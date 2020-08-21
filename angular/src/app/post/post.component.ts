import { Component, OnInit,Input } from '@angular/core';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
    @Input() post;
    constructor() { }

    ngOnInit(): void {
        function removeLeadingNumber(str) {
            function isNumber(n) {
                n = Number(n);
                if (!isNaN(n)) {
                    return true;
                }
                return false;
            }

            if (str && isNumber(str[0])) {
                str = removeLeadingNumber(str.substr(1));
            }
            return str;
        }

        this.fakeId = removeLeadingNumber(this.post._id);

        if (this.post.content.length<40) {
            this.fontSize = 22;
        }
        if (this.post.content.length<24) {
            this.fontSize = 28;
            this.align = 'center';
        }
        if (this.post.content.length<14) {
            this.fontSize = 32;
        }
        if (this.post.content.length<8) {
            this.fontSize = 44;
        }
        if (this.post.content.length<5) {
            this.fontSize = 62;
        }
    }

    public fakeId:String = "fakeid";
    public fontSize:Number = 18;
    public align:String = 'left';
}
