
export class GlobalFunc {

  public static getTarih(str: any): Date {
    if (str == null) {
      return null;
    }
    else {
      str.setHours(0, -str.getTimezoneOffset(), 0, 0);
      return str;
    }
  }

  public static formatTime(date: Date): string {
    let hours = date.getHours().toString().padStart(2, '0'); // Saat
    let minutes = date.getMinutes().toString().padStart(2, '0'); // Dakika
    let str = `${hours}:${minutes}`;
    return str; // "HH:mm" formatında döndür
  }

  public static numberListToString(input: Array<any>, sep = ';'): string {
    return input && input.length > 0 ? input.sort((a, b) => a - b).join(sep) : "";
  }

  public static stringToNumberList(input: string, sep = ';'): Array<number> {
    let list: Array<number> = [];
    if (input == null || input == undefined || (input && input.length == 0)) return list;
    else if (!input.includes(sep)) return [+input];
    let data = input.split(sep);
    if (data.length > 0) {
      data.forEach(x => {
        list.push(Number(x));
      });
    }
    return list;
  }
}