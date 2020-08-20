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
                if (!isNan(n)) {
                    return true;
                }
            }

            if (str && isNumber(str[0])) {
                str = removeLeadingNumber(str.substr(1));
            }
            return str;
        }

        this.fakeId = removeLeadingNumber(this.post._id);
    }
    public fakeId:String = "fakeid";

}
