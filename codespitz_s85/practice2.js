// Implement nested routing

const Github = class {
    constructor(id, repository) {
        this.base = `https://api.github.com/repos/${id}/${repo}/contents/`
    }

    load(path) {
        const script = document.createElement('script');

        const id = 'callback' + Github._id++;
        const callback = Github[id] = ({data : {contents}) => {
            delete Github[id];
            document.head.removeChild(script);
            this._parser.parse(contents);
        }
       
        script.src= `${this.base + path}?callback=Github${id}`;
        document.head.appendChild(script);
    }
}

Github._id = 0;

const Loader = class {
    constructor() {
        this.repoRouter = new Map;
    }
    
    addRepo(slug, name, repo) {
        this.repoRouter.set(slug, [new Github(name, repo), new Map]);
    }

    addParser(slug, exts, parser) {
        if(!this.repoRouter.get(slug)) return;
        const [_, parserRouter] = this.repoRouter.get(slug);
        exts.forEach((ext) => {
            parserRouter.set(ext, parser);
        });
    }

    load(slug, path){
        if(!this.repoRouter.get(slug)) return;
        const [github, parserRouter] = this.repoRouter.get(slug);

        const ext = path.split('.').pop();
        if(!this.parserRouter.get(ext))return;
        
        github.setParser(parserRouter.get(ext));
        github.load(path);
    }
}

const ImageParser = class {
    constructor(targetElement) {
        this._targetElement = targetElement;
    }
    parse(contents) {
        if(!this._targetElement) throw Error('_targetElement cannot be undefined');
        this._targetElement.src = 'data:text/plain;base64,' + contents;
    }
}

const MarkdownParser = class {
    constructor(targetElement) {
        this._targetElement = targetElement;
    }
    parse(contents) {
        this._targetElement.innerHTML = this._parseMarkdown(contents);
    }
    _parseMarkdown(contents) {
        const d64 = v =>decodeURIComponent(atob(v).split('').map(c=>'%' + c.charCodeAt(0).toString(16).padStart(2, '0').join('')))
        return d64(contents).split('\n').map(v => {
            let i = 3;
            while(i--) {
                if(v.startsWith('#'.repeat(i + 1))) return `<h${i+1}>${v.substr(i+1)}</h${i+1}>`;
            }
            return v;
        }).join('<br>');
    }
}

const loader = new Loader('taerim', 'js_playground');
loader.addRepo('s74', 'taerim', 'codeSpitz74');
loader.addRouter('s74', ['jpg', 'png', 'gif'], new ImageParser('#a'));
loader.addRouter('s74', ['md', 'mdx'], new MarkdownParser('#b'));

loader.addRepo('s79', 'taerim', 'codeSpit79');
loader.addRouter('s79', ['jpg', 'png', 'gif'], new ImageParser('#c'));
loader.addRouter('s79', ['md', 'mdx'], new MarkdownParser('#d'));

loader.load('s74', 'aaa.png');
loader.load('s79', 'aaa.md');
