import { isArray } from 'lodash';

export function getAsString(value: string | string[]): string {
  if (isArray(value)) {
    return value[0];
  }
  return value;
}
