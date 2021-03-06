/**
 * simple path match method, only use string and regex
 */
export declare const pathMatch: (filePath: string, matches?: (string | RegExp)[]) => boolean;
/**
 * [webpack compile time]
 *
 * inject line, column, relative-path to JSX html data attribute in source code
 *
 * @type webpack.loader.Loader
 * ref: https://astexplorer.net  +  @babel/parser
 */
export default function inspectorLoader(this: any, source: string): string;
