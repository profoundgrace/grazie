-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "bookmarkPostsCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "favoritePostsCount" INTEGER NOT NULL DEFAULT 0,
    "notesCount" INTEGER NOT NULL DEFAULT 0,
    "pagesCount" INTEGER NOT NULL DEFAULT 0,
    "postsCount" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "location" TEXT,
    "profile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bannedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "bookmarksCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "favoritesCount" INTEGER NOT NULL DEFAULT 0,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "slug" TEXT,
    "search" TEXT,
    "meta" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "search" TEXT,
    "meta" TEXT,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleUser" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "roleId" INTEGER NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER,
    "postsCount" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryPost" (
    "id" SERIAL NOT NULL,
    "catId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "CategoryPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3),
    "parentId" INTEGER,
    "postId" INTEGER NOT NULL,
    "repliesCount" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "search" TEXT,
    "meta" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "search" TEXT,
    "meta" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notesCount" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteLabel" (
    "id" SERIAL NOT NULL,
    "noteId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,

    CONSTRAINT "NoteLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'string',

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSetting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Privilege" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "Privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePrivilege" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "privilegeId" INTEGER NOT NULL,
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "conditions" TEXT,
    "description" TEXT,

    CONSTRAINT "RolePrivilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritePost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkPost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_banned" ON "User"("banned");

-- CreateIndex
CREATE INDEX "idx_user_bannedAt" ON "User"("bannedAt");

-- CreateIndex
CREATE INDEX "idx_user_createdAt" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "idx_user_lastLogin" ON "User"("lastLoginAt");

-- CreateIndex
CREATE INDEX "idx_user_updated" ON "User"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_user_verified" ON "User"("verified");

-- CreateIndex
CREATE INDEX "idx_user_verifiedAt" ON "User"("verifiedAt");

-- CreateIndex
CREATE INDEX "idx_user_bookmarks" ON "User"("bookmarkPostsCount");

-- CreateIndex
CREATE INDEX "idx_user_comments" ON "User"("commentsCount");

-- CreateIndex
CREATE INDEX "idx_user_favorite_posts" ON "User"("favoritePostsCount");

-- CreateIndex
CREATE INDEX "idx_user_notes" ON "User"("notesCount");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_email" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_username" ON "User"("username");

-- CreateIndex
CREATE INDEX "idx_post_author" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "idx_post_bookmarks_count" ON "Post"("bookmarksCount");

-- CreateIndex
CREATE INDEX "idx_post_comments_count" ON "Post"("commentsCount");

-- CreateIndex
CREATE INDEX "idx_post_favorites_count" ON "Post"("favoritesCount");

-- CreateIndex
CREATE INDEX "idx_post_created" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "idx_post_published" ON "Post"("published");

-- CreateIndex
CREATE INDEX "idx_post_publishedAt" ON "Post"("publishedAt");

-- CreateIndex
CREATE INDEX "idx_post_updated" ON "Post"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_post_views_count" ON "Post"("viewsCount");

-- CreateIndex
CREATE INDEX "idx_post_search" ON "Post"("search");

-- CreateIndex
CREATE UNIQUE INDEX "unq_post_slug" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "idx_page_author" ON "Page"("authorId");

-- CreateIndex
CREATE INDEX "idx_page_created" ON "Page"("createdAt");

-- CreateIndex
CREATE INDEX "idx_page_published" ON "Page"("published");

-- CreateIndex
CREATE INDEX "idx_page_publishedAt" ON "Page"("publishedAt");

-- CreateIndex
CREATE INDEX "idx_page_updated" ON "Page"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_page_search" ON "Page"("search");

-- CreateIndex
CREATE INDEX "idx_page_summary" ON "Page"("summary");

-- CreateIndex
CREATE INDEX "idx_page_views_count" ON "Page"("viewsCount");

-- CreateIndex
CREATE UNIQUE INDEX "unq_page_slug" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "idx_role_active" ON "Role"("active");

-- CreateIndex
CREATE UNIQUE INDEX "unq_role_name" ON "Role"("name");

-- CreateIndex
CREATE INDEX "idx_user_role_active" ON "RoleUser"("active");

-- CreateIndex
CREATE INDEX "idx_user_role_user" ON "RoleUser"("userId");

-- CreateIndex
CREATE INDEX "idx_user_role_created" ON "RoleUser"("createdAt");

-- CreateIndex
CREATE INDEX "idx_user_role_updated" ON "RoleUser"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_role" ON "RoleUser"("roleId", "userId");

-- CreateIndex
CREATE INDEX "idx_category_parent" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "idx_category_posts" ON "Category"("postsCount");

-- CreateIndex
CREATE INDEX "idx_category_description" ON "Category"("description");

-- CreateIndex
CREATE UNIQUE INDEX "unq_category_name" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unq_category_slug" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "unq_category_path" ON "Category"("path");

-- CreateIndex
CREATE INDEX "idx_category_post_cat" ON "CategoryPost"("catId");

-- CreateIndex
CREATE INDEX "idx_category_post" ON "CategoryPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "unq_category_post" ON "CategoryPost"("catId", "postId");

-- CreateIndex
CREATE INDEX "idx_comment_author" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "idx_comment_created" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "idx_comment_updated" ON "Comment"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_comment_last_activity" ON "Comment"("lastActivityAt");

-- CreateIndex
CREATE INDEX "idx_comment_locked" ON "Comment"("locked");

-- CreateIndex
CREATE INDEX "idx_comment_pinned" ON "Comment"("pinned");

-- CreateIndex
CREATE INDEX "idx_comment_parent" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "idx_comment_post" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "idx_comment_replies_count" ON "Comment"("repliesCount");

-- CreateIndex
CREATE INDEX "idx_comment_path" ON "Comment"("path");

-- CreateIndex
CREATE INDEX "idx_comment_search" ON "Comment"("search");

-- CreateIndex
CREATE INDEX "idx_note_author" ON "Note"("authorId");

-- CreateIndex
CREATE INDEX "idx_note_created" ON "Note"("createdAt");

-- CreateIndex
CREATE INDEX "idx_note_updated" ON "Note"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_note_pinned" ON "Note"("pinned");

-- CreateIndex
CREATE INDEX "idx_note_title" ON "Note"("title");

-- CreateIndex
CREATE INDEX "idx_note_search" ON "Note"("search");

-- CreateIndex
CREATE INDEX "idx_note_type" ON "Note"("type");

-- CreateIndex
CREATE INDEX "idx_label_created" ON "Label"("createdAt");

-- CreateIndex
CREATE INDEX "idx_label_updated" ON "Label"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_label_name" ON "Label"("name");

-- CreateIndex
CREATE INDEX "idx_label_slug" ON "Label"("slug");

-- CreateIndex
CREATE INDEX "idx_note_label_noteId" ON "NoteLabel"("noteId");

-- CreateIndex
CREATE INDEX "idx_note_label_labelId" ON "NoteLabel"("labelId");

-- CreateIndex
CREATE UNIQUE INDEX "unq_note_label" ON "NoteLabel"("noteId", "labelId");

-- CreateIndex
CREATE INDEX "idx_setting_description" ON "Setting"("description");

-- CreateIndex
CREATE INDEX "idx_setting_type" ON "Setting"("type");

-- CreateIndex
CREATE UNIQUE INDEX "unq_setting_name" ON "Setting"("name");

-- CreateIndex
CREATE INDEX "idx_user_setting_user" ON "UserSetting"("userId");

-- CreateIndex
CREATE INDEX "idx_user_setting_name" ON "UserSetting"("name");

-- CreateIndex
CREATE INDEX "idx_user_setting_type" ON "UserSetting"("type");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_setting_name" ON "UserSetting"("userId", "name");

-- CreateIndex
CREATE INDEX "idx_privilege_subject" ON "Privilege"("subject");

-- CreateIndex
CREATE INDEX "idx_privilege_action" ON "Privilege"("action");

-- CreateIndex
CREATE UNIQUE INDEX "unq_privilege" ON "Privilege"("subject", "action");

-- CreateIndex
CREATE INDEX "idx_role_privilege_role" ON "RolePrivilege"("roleId");

-- CreateIndex
CREATE INDEX "idx_role_privilege" ON "RolePrivilege"("privilegeId");

-- CreateIndex
CREATE INDEX "idx_role_privilege_inverted" ON "RolePrivilege"("inverted");

-- CreateIndex
CREATE INDEX "idx_role_privilege_description" ON "RolePrivilege"("description");

-- CreateIndex
CREATE INDEX "idx_favorite_post_user" ON "FavoritePost"("userId");

-- CreateIndex
CREATE INDEX "idx_favorite_post_post" ON "FavoritePost"("postId");

-- CreateIndex
CREATE INDEX "idx_favorite_post_created" ON "FavoritePost"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "unq_favorite_post" ON "FavoritePost"("userId", "postId");

-- CreateIndex
CREATE INDEX "idx_bookmark_post_user" ON "BookmarkPost"("userId");

-- CreateIndex
CREATE INDEX "idx_bookmark_post_post" ON "BookmarkPost"("postId");

-- CreateIndex
CREATE INDEX "idx_bookmark_post_created" ON "BookmarkPost"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "unq_bookmark_post" ON "BookmarkPost"("userId", "postId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleUser" ADD CONSTRAINT "RoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleUser" ADD CONSTRAINT "RoleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryPost" ADD CONSTRAINT "CategoryPost_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryPost" ADD CONSTRAINT "CategoryPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteLabel" ADD CONSTRAINT "NoteLabel_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteLabel" ADD CONSTRAINT "NoteLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSetting" ADD CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePrivilege" ADD CONSTRAINT "RolePrivilege_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePrivilege" ADD CONSTRAINT "RolePrivilege_privilegeId_fkey" FOREIGN KEY ("privilegeId") REFERENCES "Privilege"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePost" ADD CONSTRAINT "FavoritePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePost" ADD CONSTRAINT "FavoritePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkPost" ADD CONSTRAINT "BookmarkPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkPost" ADD CONSTRAINT "BookmarkPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Role" ("active","name","description") VALUES
	 (true,'admin','Administrator Role - Super User'),
	 (true,'everyone','Basic role, with limited permissions'),
	 (true,'user','User permissions');

INSERT INTO "Privilege" ("subject","action") VALUES
	 ('Post','read'),
	 ('Post','create'),
	 ('Post','update'),
	 ('Post','delete'),
	 ('Page','create'),
	 ('Page','read'),
	 ('Page','update'),
	 ('Page','delete'),
	 ('Category','create'),
	 ('Category','read'),
	 ('Category','update'),
	 ('Category','delete'),
	 ('Role','create'),
	 ('Role','read'),
	 ('Role','update'),
	 ('Role','delete'),
	 ('RoleUser','create'),
	 ('RoleUser','read'),
	 ('RoleUser','update'),
	 ('RoleUser','delete'),
	 ('RolePrivlege','create'),
	 ('RolePrivlege','read'),
	 ('RolePrivlege','update'),
	 ('RolePrivlege','delete'),
	 ('Setting','create'),
	 ('Setting','read'),
	 ('Setting','update'),
	 ('Setting','delete'),
	 ('User','create'),
	 ('User','read'),
	 ('User','update'),
	 ('User','delete'),
	 ('all','manage'),
	 ('User','register'),
	 ('User','login'),
	 ('Comment','create'),
	 ('Comment','read'),
	 ('Comment','update'),
	 ('Comment','delete'),
	 ('Note','create'),
	 ('Note','read'),
	 ('Note','update'),
	 ('Note','delete'),
	 ('Dashboard','read');

INSERT INTO "RolePrivilege" ("roleId","privilegeId","inverted","conditions","description") VALUES
	 (1,33,false,NULL,'Administrator'),
	 (2,1,false,'{
  "published": true
}','Read published Posts'),
	 (2,10,false,NULL,'Read Categories'),
	 (2,37,false,NULL,'Read Comments'),
	 (2,6,false,'{
  "published": true
}','Read published Pages'),
     (3,44,false,NULL,'Dashboard User Access');


INSERT INTO "RoleUser" ("active","roleId","userId","createdAt","updatedAt") VALUES
	 (true,2,NULL,'2024-03-24T18:48:17.351Z','2024-03-24T18:48:17.351Z');

INSERT INTO "Setting" ("name","value","type","description") VALUES
	 ('navbar.links','[
  {
    "label": "Posts",
    "to": "/posts"
  },
  {
    "label": "Categories",
    "to": "/categories"
  },
  {
    "label": "Pages",
    "to": "/pages"
  },
  {
    "label": "Notes",
    "to": "/notes"
  }
]','array',NULL),
	 ('site.name','Grazie!','string',NULL),
	 ('site.copyright','2024','string',NULL),
	 ('page.home.columns','3','number',NULL),
	 ('footer.links','[
  {
    "label": "Posts",
    "to": "/posts"
  },
  {
    "label": "Categories",
    "to": "/categories"
  },
  {
    "label": "Pages",
    "to": "/pages"
  }
]','array',NULL);