import bcrypt from 'bcrypt';
import { getLogger } from '~/utils/logger.server';
import { avatarURL } from '~/utils/config.server';
import { prisma } from '~/utils/prisma.server';
import { timeStamp } from '~/utils/generic.server';
import type { User, UserLogin, UserSystem } from '~/types/User';
import { getUserId } from '~/utils/session.server';

const log = getLogger('User');

export async function createUser({
  username,
  displayName,
  email,
  password
}: UserSystem) {
  try {
    const userCheck = await prisma.user.findMany({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (userCheck.length > 0) {
      throw new Error('Username or Email already taken');
    }
    if (!displayName) {
      displayName = username as string;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password as string, salt);
    const date = timeStamp();
    const user = await prisma.user.create({
      data: {
        displayName,
        username: username as string,
        email: email as string,
        password: hashedPassword,
        createdAt: date,
        updatedAt: date,
        lastLoginAt: date
      }
    });

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function userLogin({ email, password }: UserLogin) {
  try {
    const login = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        password: true
      }
    });

    if (!login) {
      throw new Error('Incorrect Username or Email');
    }
    const verification = await bcrypt.compare(password, login.password);

    if (!verification) {
      throw new Error('Incorrect Password');
    }

    return {
      id: login.id,
      username: login.username,
      displayName: login.displayName
    };
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function getUserById(id: User['id']) {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id: id as number
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatar: true
      }
    })) as User;

    if (!user) {
      throw new Error('User ID was not Found!');
    }

    user.isLoggedIn = true;

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function getUserByUsername(username: User['username']) {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        username: username as string
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatar: true
      }
    })) as User;

    if (!user) {
      throw new Error('User ID was not Found!');
    }

    user.isLoggedIn = true;

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function getUserAccount(id: User['id']) {
  try {
    const account = await prisma.user.findUnique({
      where: {
        id: id as number
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        email: true,
        avatar: true
      }
    });

    if (!account) {
      throw new Error('User ID was not Found!');
    }

    account.isLoggedIn = true;

    return {
      ...account,
      avatar: account?.avatar
        ? {
            sm: `${avatarURL}sm/${account?.avatar}`,
            md: `${avatarURL}md/${account?.avatar}`,
            lg: `${avatarURL}lg/${account?.avatar}`
          }
        : null
    };
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function getUser({
  id,
  username,
  userId
}: {
  id: string | undefined;
  username: string | undefined;
  userId: string | undefined;
}) {
  try {
    if (id) {
      // Used for administration
      return await users.document(id);
    }
    let connection;
    if (username) {
      // Used for User page
      if (userId) {
        connection = aql`LET connections = (
          FOR connection, edge IN OUTBOUND user ${hasConnection}
            
            OPTIONS {
              bfs: true,
              uniqueVertices: 'global'
            }
            FILTER connection._key == ${userId}
          RETURN { status: edge.status, createdAt: edge.createdAt, updatedAt: edge.updatedAt }
        )`;
      } else {
        connection = aql`LET connections = [{}]`;
      }
      const data = await db.query(
        aql`
          FOR user IN ${users}
            FILTER user.username == ${username}
            LIMIT 1
            ${connection}
            RETURN {
              "id" : user._key,
              "username" : user.username,
              "createdAt" : user.createdAt,
              "updatedAt" : user.updatedAt,
              "connection" : connections[0],
              "avatar" : user.avatar
            }`
      );
      const user = await data.next();

      user.connected = Boolean(user?.connection?.status === 'Active');
      user.avatar = `${avatarURL}md/${user?.avatar}`;

      return user;
    }
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getUsers({ select }) {
  try {
    const data = await prisma.user.findMany({
      select,
      orderBy: { id: 'asc' }
    });

    return { nodes: data, storage: avatarURL };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
