import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { 
  faThumbsUp,
  faThumbsDown,
  faShareSquare
 } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';

 

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() posts;
  faThumbsUp=faThumbsUp;
  faThumbsDown=faThumbsDown;
  faShareSquare=faShareSquare;
  
   uid=null;
   upVote:number=0;
   downVote:number=0;
  constructor(
    private auth: AuthService,
    private db:AngularFireDatabase
  ) { 
    this.auth.getUser().subscribe((user)=>{
      this.uid = user?.uid;
    })
  }
    
  ngOnInit(): void {
  }
  ngOnChanges(): void {
    if (this.posts.vote) {
      Object.values(this.posts.vote).map((val:any)=>{
        if (val.upVote) {
          this.upVote += 1
        }
        if (val.downVote) {
          this.downVote += 1
        }
      })
    }
    
  }
  upVotePost(){
    console.log("upVoting");
    this.db.object(`/posts/${this.posts.id}/vote/${this.uid}`)
    .set({
      upVote:1,
     
    });
       
  }

  downVotePost(){
    console.log("downVoting");
    this.db.object(`/posts/${this.posts.id}/vote/${this.uid}`)
    .set({
      downVote:1,
      
    });
       
  }

  getInstaUrl(){
    return `https://instagram.com/${this.posts.instaId}`
  }
}
