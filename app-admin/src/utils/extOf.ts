export const extOf = (file: File) => {
  const m = file.name.match(/\.[^\.]+$/);
  return m ? m[0] : '';
}