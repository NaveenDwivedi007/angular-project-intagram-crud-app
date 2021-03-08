import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//services
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
//form
import { NgForm } from '@angular/forms';
//form rxjs 
import { finalize } from 'rxjs/operators';
// from angular/ fire
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
//browser image resizer
import { readAndCompressImage } from 'browser-image-resizer';
import { imageConfig } from 'src/ultil/config';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {
  locationName:string;
  description:string;
  picture:string=null;

  user=null;
  uploadPercent:number= null;
  constructor(
    private auth:AuthService,
    private router:Router,
    private storage :AngularFireStorage,
    private db: AngularFireDatabase,
    private toastr :ToastrService,

    ) { 
      auth.getUser().subscribe((user)=>{
        this.db.object(`/user/${user.uid}`) 
        .valueChanges()
        .subscribe((user)=>{
          this.user= user;
          console.log(user);
        })
      })
    }

  ngOnInit(): void {
  }
  
  onSubmit(){
   const uid = uuid();
   this.db.object(`/posts/${uid}`)
   .set({
     id:uid,
     locationName:this.locationName,
     description:this.description,
     picture:this.picture,
     by: this.user.name,
     instaId:this.user.instaUsername,
     date:Date.now()
   })
   .then(()=>{
     this.toastr.success("post added successfully");
     this.router.navigateByUrl("/");
   })
   .catch((err)=>{
     this.toastr.error(err.message,"",{closeButton:true})
   })
  }
  async uploadFile(event){
    const file = event.target.files[0];
    let resizedImage= await readAndCompressImage( file,imageConfig );
    const filePath=uuid();
    const fileref= this.storage.ref(filePath);

    const task= this.storage.upload(filePath,resizedImage);
    task.percentageChanges().subscribe((percentage)=>{
      this.uploadPercent=percentage;
    })
    task.snapshotChanges().pipe(
      finalize(()=>{
        fileref.getDownloadURL().subscribe((url)=>{
          this.picture=url;
        })
      })
    ).subscribe()
  }
}
