export const getChapterlist = async () => {
  const response = await fetch("/api/chapters");
  const data = await response.json();
  return data?.chapters || [];
}