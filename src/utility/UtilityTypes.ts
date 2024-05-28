/** Any function returning a Promise.
 * @see [[AsyncMethodsOf]] to extract all async methods from a type.
 * @see [[PromiseReturnType]] to extract the type to which the Promise resolves.
 * @public
 */
export type AsyncFunction = (...args: any[]) => Promise<unknown>;

/** Extracts the names of all function properties of `T` that return a Promise.
 * @public
 */
export type AsyncMethodsOf<T> = {
  [P in keyof T]: T[P] extends AsyncFunction ? P : never;
}[keyof T];
