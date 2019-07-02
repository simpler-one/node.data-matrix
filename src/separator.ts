export class Separator {
    public static readonly Brace0: Separator = new Separator('{');
    public static readonly Brace1: Separator = new Separator('}');
    public static readonly Brack0: Separator = new Separator('[', true);
    public static readonly Brack1: Separator = new Separator(']', true);
    public static readonly VertLn: Separator = new Separator('|', true);

    public static All: Separator[] = [
        Separator.Brace0, Separator.Brace1, Separator.Brack0, Separator.Brack1, Separator.VertLn,
    ];
    public static Closers: Separator[] = [
        Separator.Brace1, Separator.Brack1,
    ];

    private readonly escaped: string;
    private readonly exp: RegExp;
    private readonly commaExp: RegExp;

    private constructor(
        private readonly char: string,
        escape: boolean = false,
    ) {
        this.escaped = `${escape ? '\\' : ''}${char}`;
        this.exp = new RegExp(this.escaped, 'g');
        this.commaExp = new RegExp(`,${this.escaped}`, 'g');
    }

    public sandSpace(text: string): string {
        return text.replace(this.exp, ` ${this.char} `);
    }
    public removeComma(text: string): string {
        return text.replace(this.commaExp, this.char);
    }
}
