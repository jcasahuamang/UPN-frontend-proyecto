import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor() { }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  formatClock(date: Date): string {
    const currentTime = new Date(date);
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let amPm = hours < 12 ? 'AM' : 'PM';

    // Convertir horas a formato de 12 horas
    hours = hours % 12 || 12;

    // Formatear minutos para tener dos dígitos
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

    // Retornar el formato en cadena
    return `${hours}:${formattedMinutes} ${amPm}`;
  }

  formatCalendar(date: Date): string {
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const f = new Date(date);

    return `${days[f.getDay()]}, ${f.getDate()} de ${months[f.getMonth()]} del ${f.getFullYear()}`;
  }
}
