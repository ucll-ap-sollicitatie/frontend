import { useEffect, useRef, useState } from "react";

export function capitalize(word: string): string {
  if (word === undefined || word.length === 0) return word;

  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().valueOf() - new Date(date).valueOf()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " jaar geleden";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " maand geleden";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " dagen geleden";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " uur geleden";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minuten geleden";
  }
  return Math.floor(seconds) + 1 + " seconden geleden";
}

export function milisecondsToReadableTime(ms: number): string {
  let milliseconds: number | string = Math.floor((ms % 1000) / 100),
    seconds: number | string = Math.floor((ms / 1000) % 60),
    minutes: number | string = Math.floor((ms / (1000 * 60)) % 60),
    hours: number | string = Math.floor((ms / (1000 * 60 * 60)) % 24);
  milliseconds = Math.floor(ms % 1000);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  if (milliseconds < 100) {
    if (milliseconds < 10) {
      milliseconds = "00" + milliseconds;
    } else {
      milliseconds = "0" + milliseconds;
    }
  }
  return hours + ":" + minutes + ":" + seconds + "," + milliseconds;
}

// Locale
export function getLocale(): string {
  return localStorage.getItem("locale") || "nl";
}

export function setLocale(locale: string): void {
  localStorage.setItem("locale", locale);
}

// Dark mode
export function isDarkMode(): boolean {
  return localStorage.getItem("darkMode") === "true";
}

export function toggleDarkMode(): void {
  const darkMode = !isDarkMode();
  if (darkMode) {
    document.children[0].classList.add("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  } else {
    document.children[0].classList.remove("dark");
    localStorage.removeItem("darkMode");
  }
}

export function initializeDarkMode(): void {
  if (isDarkMode()) {
    document.children[0].classList.add("dark");
  }
}

export function isPasswordValid(password: string, password_check: string): string {
  if (password !== password_check) {
    return "password_mismatch";
  } else if (password.length < 8) {
    return "password_too_short";
  } else if (password.length > 50) {
    return "password_too_long";
  } else if (password.search(/\d/) == -1) {
    return "password_no_number";
  } else if (password.search(/[a-zA-Z]/) == -1) {
    return "password_no_letter";
  } else {
    return "password_ok";
  }
}

export function validateEmail(email: string) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}
