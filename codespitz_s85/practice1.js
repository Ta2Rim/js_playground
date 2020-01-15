// Change code base function to class using strategy pattern

const Github = class {
    constructor(id, repository) {
        this.base = `https://api.github.com/repos/${id}/${repo}/contents/`
    }

    set parser(v) {
        this._parser = v;
    }

    load(path) {
        if(!this._parser) return;
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

const ImageParser = class {
    constructor(targetElement) {
        this._targetElement = targetElement;
    }
    parse(contents) {
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

const loader1 = new Github('taerim', 'js_playground');
loader1.parser = new ImageParser('#a');
loader1.load('abc.png');

const loader2 = new Github('taerim', 'taesdevblog');
loader2.parser = new MarkdownParser('#b');
loader2.load('aaa.md');