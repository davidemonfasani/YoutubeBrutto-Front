import { Component, OnInit  } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { VideoService } from 'src/app/services/video.service';
import { Commento } from 'src/app/interfaces/commento';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Video } from 'src/app/interfaces/video';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {
  CommentForm:FormGroup;
  utente : any;
  comments: Commento[] = [];
  condition =false;
  constructor(private vidService : VideoService,
    private comService : CommentService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    ) {
      this.CommentForm = this.formBuilder.group({
        Text: ['', Validators.required],
      });
    }
  body: Video = {
    id: 0,
    titolo : '',
    descrizione : '',
    linkvideo : '',
    linkimage : '',
    utente_username : '',
  };

  showDescription = false;

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }

  sanitize(a : string) {
    return this.vidService.sanitizeVideoUrl(a)
  }
  ngOnInit() {
    this.vidService.getVideo().subscribe((video) => {
      console.log(video);
      this.body = video;
    });
    this.fetchComments();
      console.log('prendo i commenti di:', this.body.id);
  }
  likeChange(){
    if(this.condition)
    {
      this.condition=false
    }
    else
    {
      this.condition=true
    }

  }


  fetchComments() {
    this.comService.fetchComments(this.body.id)
      .subscribe((result: Commento[]) => {
        this.comments = result;
        console.log('i comment', this.comments)
      });
  }

  registerComment() {

    const utenteString = localStorage.getItem('utente')
    if(utenteString) {
      this.utente = JSON.parse(utenteString)
    }
    const bodyComment = {
      video_id:this.body.id,
      utente_id:this.utente.id,
      video_titolo: this.body.titolo,
      testo: this.CommentForm.value.Text,
    };
    this.comService.registerComment(bodyComment).subscribe(() => {
      this.fetchComments();
    });
  }











}
