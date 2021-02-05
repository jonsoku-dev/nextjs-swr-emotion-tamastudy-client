const htmlTagsToRemove = ['<p>', '</p>', '<br>'];

export const removeHtmlTags = (inputData?: string) => {
  let text = inputData ?? '';

  htmlTagsToRemove.forEach((it) => {
    text = text.replace(it, '');
  });
  return text;
};
