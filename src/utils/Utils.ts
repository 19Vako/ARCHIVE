

export function reverseWord(str: string): string {
    return str
      .split('-')
      .reverse()
      .join('-');
};

export const today = new Date().toISOString().split("T")[0];

export  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
};
