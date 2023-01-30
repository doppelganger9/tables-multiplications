import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'egale' // parce que 'equals' semblait provoquer un conflit
})
export class EqualsPipe implements PipeTransform {
  /**
   * @param value The string to transform to lower case.
   */
  transform(
    value: number | null | undefined,
    expected: number | null | undefined
  ): boolean | null {
    console.log(value, expected);
    if (value == null) return null;
    if (typeof value !== 'number') {
      throw new Error(
        `InvalidPipeArgument: '${value}' for pipe '${JSON.stringify(value)}'`
      );
    }
    if (typeof expected !== 'number') {
      throw new Error(
        `InvalidPipeArgument: '${expected}' for pipe '${JSON.stringify(
          expected
        )}'`
      );
    }
    return value === expected;
  }
}
