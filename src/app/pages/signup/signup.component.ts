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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  picture:string= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAe1BMVEX///8AAABXV1dTU1PU1NR5eXkLCwvv7+8HBwckJCQfHx/8/PwPDw+rq6tJSUl1dXVOTk7o6OgaGhr19fU9PT3BwcFdXV2FhYXHx8eampqhoaFkZGQsLCxDQ0OQkJAVFRVubm63t7eTk5M0NDTFxcWIiIhiYmLb29u5ubkSuS9mAAAEzUlEQVR4nO2cbVviOhCGSaVQoQWhvIiIgKuH/f+/cHHZruIWyDyTaXqd67m/q7ltJm8zSadDCCGEEEIIIYQQQgghhBBCCCGEEEL+T0zmq2W6WySL9fi9mPdjNwei/JnOcnfOdLR8HMZumIj+apO5evKkKGM3z5d9csniRG/Xjd1ED4bF81WLE5t57Hbe4uneQ+OD2WPspl6jO/PU+GAxid3cS5Tj67HxnfwpdovrOfgExzkPbfwoTz2xx3FmaV+k7ACNI1nLutcwwTyOLGO3/SvlBvZwbhe79Z+oPJwbx25/xfBO5dGe3rVWejjXjoh/UXu4rA2j8KNsOq9nGn9m7A8CeBzn+NgeHXwCOWcV2WMfyMPln52rfFul6yRZ7JZFYzuw0nf7cZvF6TdOXmZfgy6/a2ZnvAzm4dzb8fd1a3pqPrYfCSbIivcSs055YeWZpdZfJQ3o4dzr5X46eDP16H8/uDLk3VLkvTkP59aGR3th5kJf/jPzmDfq4VxqJaJf9QopbDzKBkP9RG4zoTTds44kJiJhJxE/TKYTyfHoOT14QTAy8CjxDVVRwD9qsBx+hBuTKrqlwYnLE9qW0XGKHo7AH56GF0H/qfe/c6J9dCMTvm+Bh1m9Py3pggH/GlzkB9aQv7MzGPDr4CJY3/iyXsL65iy4yBRpxujLWhwL+EFwEaSP358VP0ABnwcXARrR+zbkIAGfBdYokRPff5bhQMD3wnoUyOawZmMkD/igMTJ5ADTOAr1CHvCbgB57aEd1X1vlJA74cIut4RjR+CfQK6QBvw/lUULd6sp+Wxjw22WY+rUS3E5dOQGRfuHta4ATrhJcYdUFeoU84J/VmbohmIeuD/QK+QyfpcqPssA8LgV6BTDDb1QnQ2j+9ubBGjDDDxQ7LDR/63HUCQzpWzhQSnk91m+uBXoFEnw5agJu0q8HegWypM+x3nXAOtatQK9AlvQDKOJDz+jfQfbwM2AU7mIegpwGsoYDUibY6Y9PoFdAs624EPoAefgFegVS1vIs7VzQkOUb6BVIwEuL1qC8pzhVBgR8LlvVQ0fvQCQCAS/bMiI9SxLoFUDA56LyDnAb8smV7J+2tPNF4NHXeliKPAtE9AlcQxFJykRfSGopIhhU9DUOliI//EV0JePWIs5/KgG3VE2J/PQW2bZbxL8oTV+6aCqy8BZR/ylbEf+8or783VTEP2eir8wyFfHPK+qLF01F/POKLR9+/UXAE5SmRPy7FpakakzEP9hX7RbxX8jjRWaNiPhfBxqqx19TEcG2XR3tpiKCa03qnZWpiGCLOGmziKjOUbu1shTxX/x2FDWlDYiIDjRL5d7KUER2Qqe932YoIizXVN6nMhSRZhJ1n8RORFz3r7sEaiciT1LvWylyJ/bQXZS2EukhGWq4MN9QBLtnqXhMwEhkA5Y74fP79O4iUG36iS1c7NTopdabZIrnxsAngmxQXbCMcWnvApLkYQ0BnkEJg/q5i6Lxq611ZAEu7h7UyWo9gyBv20gfmwvPQ6jnREXP/wVnGvI+uNe7kiZk48CvuxZRvkrP4pWUQ9rsqw/OzVZWb+12Xx6aGo23yepgZPGHj+eJx+tFYsZ6l67m8V/gIoQQQgghhBBCCCGEEEIIIYQQQgghQn4BuaNO9x7RTEEAAAAASUVORK5CYII="
  // "http://learnyst.s3.awazonaws.com/assets/schools/2410/resourses/images/logo_lco_i3oab.png";

  uploadPercent:number=null;
  constructor(
    private auth:AuthService,
    private router:Router,
    private toastr:ToastrService,
    private db:AngularFireDatabase,
    private storage:AngularFireStorage,
    
  ) { }

  ngOnInit(): void {
  } 

  onSubmit(f:NgForm){
    const {email,password,username,country,bio,name}=f.form.value;
    
    this.auth.signUp(email,password)
    .then(
      (res)=>{
        console.log(res);
        const {uid} = res.user;
        this.db.object(`/user/${uid}`)
        .set({
          id:uid,
          name:name,
          email:email,
          instaUsername:username,
          country:country,
          bio:bio,
          picture:this.picture,
        })
      }
    )
    .then(
      ()=>{
        this.router.navigateByUrl('/');
        this.toastr.success("Sign Up Success")
      }
    )
    .catch((err)=>{
      console.log(err);
      this.toastr.error("SignUp Failed");
    })


  }

  async uploadFile(event){
    
    const file = event.target.files[0];
    
    // console.log(uuid());
    let resize= await readAndCompressImage(file, imageConfig);
    
    const filePath = uuid();
    
    console.log(filePath);  
    const fileRef = this.storage.ref(filePath);
    
    const task =this.storage.upload(filePath,resize);
    task.percentageChanges().subscribe((percent)=>{this.uploadPercent=percent});

    task.snapshotChanges().pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe((url)=>{
          this.picture=url;
          this.toastr.success("upload success");
        })
      })
    ).subscribe();
  }
}
// async uploadFile(event) {
//   const file = event.target.files[0];

//   let resizedImage = await readAndCompressImage(file, imageConfig);

//   const filePath = file.name; // rename the image with TODO: UUID
//   const fileRef = this.storage.ref(filePath);

//   const task = this.storage.upload(filePath, resizedImage);

//   task.percentageChanges().subscribe((percetage) => {
//     this.uploadPercent = percetage;
//   });

//   task.snapshotChanges()
//     .pipe(
//       finalize(() => {
//         fileRef.getDownloadURL().subscribe((url) => {
//           this.picture = url;
//           this.toastr.success("image upload success");
//         });
//       }),
//     )
//     .subscribe();
// }

