import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users=[];
  posts=[];
  isLoading=false;

  constructor(
    private toastr:ToastrService,
    private db:AngularFireDatabase,

  ) { 
    this.isLoading=true;

    // Get all user
    db.object(`/user`).valueChanges().subscribe((obj=>{
      if (obj) {
        this.users= Object.values(obj);
        console.log(this.users);
        this.isLoading=false;
      }
      else{
        this.toastr.error("User Not Found");
        this.users=[];
        this.isLoading=false;
      }
    }))

    //grab all post from fireBase

    db.object(`/posts`)
    .valueChanges()
    .subscribe((obj)=>{
      if (obj) {
        this.posts= Object.values(obj).sort((a,b)=>b.date-a.date);
      this.isLoading=false;
      } else {
        this.toastr.error("No Post to display");
        this.posts=[];
        this.isLoading=false;
      }
      
    })

  }

  ngOnInit(): void {
  }

}
