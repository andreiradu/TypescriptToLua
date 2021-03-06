import { Expect, Test, TestCase } from "alsatian";

import * as ts from "typescript";
import * as util from "../src/util";

export class ClassTests {

    @Test("ClassFieldInitializer")
    public classFieldInitializer(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                field: number = 4;
            }
            return new a().field;`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("ClassConstructor")
    public classConstructor(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                field: number = 3;
                constructor(n: number) {
                    this.field = n * 2;
                }
            }
            return new a(4).field;`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(8);
    }

    @Test("ClassConstructorAssignment")
    public classConstructorAssignment(): void {
         // Transpile
        const lua = util.transpileString(
            `class a { constructor(public field: number) {} }
            return new a(4).field;`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("ClassNewNoBrackets")
    public classNewNoBrackets(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                public field: number = 4;
                constructor() {}
            }
            let inst = new a;
            return inst.field;`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("ClassStaticFields")
    public classStaticFields(): void {
        // Transpile
        const lua = util.transpileString(
            `class a { static field: number = 4; }
            return a.field;`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("classExtends")
    public classExtends(): void {
        // Transpile
        const lua = util.transpileString(
            `class a { field: number = 4; }
            class b extends a {}
            return new b().field;`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("classSuper")
    public classSuper(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                public field: number = 4;
                constructor(n: number) {
                    this.field = n;
                }
            }
            class b extends a {
                constructor() {
                    super(5);
                }
            }
            return new b().field;`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(5);
    }

    @Test("classSuperSuper")
    public classSuperSuper(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                public field: number = 4;
                constructor(n: number) {
                    this.field = n;
                }
            }
            class b extends a {
                constructor(n: number) {
                    super(n * 2);
                }
            }
            class c extends b {
                constructor() {
                    super(5);
                }
            }
            return new c().field;`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(10);
    }

    @Test("ClassMethodCall")
    public classMethodCall(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                public method(): number {
                    return 4;
                }
            }
            let inst = new a();
            return inst.method();`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("ClassInheritedMethodCall")
    public classInheritedMethodCall(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                public method(): number {
                    return 4;
                }
            }
            class b extends a {}
            let inst = new b();
            return inst.method();`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("ClassDoubleInheritedMethodCall")
    public classDoubleInheritedMethodCall(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                public method(): number {
                    return 4;
                }
            }
            class b extends a {}
            class c extends b {}
            let inst = new c();
            return inst.method();`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("ClassInheritedMethodCall2")
    public classInheritedMethodCall2(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {}
            class b extends a {
                public method(): number {
                    return 4;
                }
            }
            class c extends b {}
            let inst = new c();
            return inst.method();`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("ClassMethodOverride")
    public classMethodOverride(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                public method(): number {
                    return 2;
                }
            }
            class b extends a {
                public method(): number {
                    return 4;
                }
            }
            let inst = new b();
            return inst.method();`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(4);
    }

    @Test("methodDefaultParameters")
    public methodInheritedParameters(): void {
        // Transpile
        const lua = util.transpileString(
            `class a {
                public method(b: number, c: number = 5): number {
                    return b + c;
                }
            }
            let inst = new a();
            return inst.method(4);`
        );

        // Execute
        const result = util.executeLua(lua);

        // Assert
        Expect(result).toBe(9);
    }

    @Test("Class without name error")
    public classWithoutNameError(): void {
        const transpiler = util.makeTestTranspiler();

        Expect(() => transpiler.transpileClass({} as ts.ClassDeclaration))
            .toThrowError(Error, "Class declarations must have a name.");
    }
}
