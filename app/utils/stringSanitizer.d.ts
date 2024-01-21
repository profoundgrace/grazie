/**
The MIT License (MIT)
Copyright (c) Md. Fazlul Karim <fazlulkarimrocky@gmail.com> (http://twitter.com/fazlulkarimweb)
https://github.com/fazlulkarimweb/string-sanitizer
*/

export type TSanitizer = (s: string) => string;

interface ISanitize extends TSanitizer {
  keepUnicode: TSanitizer;
  keepSpace: TSanitizer;
  addFullstop: TSanitizer;
  addUnderscore: TSanitizer;
  addDash: TSanitizer;
  removeNumber: TSanitizer;
  keepNumber: TSanitizer;
}

export const sanitize: ISanitize;
export const addFullstop: TSanitizer;
export const addUnderscore: TSanitizer;
export const addDash: TSanitizer;
export const removeSpace: TSanitizer;
