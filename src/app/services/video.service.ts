import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Video } from '../interfaces/video';
import { Observable, catchError, of, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class VideoService {
  video = {
    id:0,
    titolo: '',
    descrizione: '',
    utente_username: '',
    linkvideo: ''
  }
  constructor(private http : HttpClient,
    private router: Router,
    private sanitizer : DomSanitizer,
    private route: ActivatedRoute
  )
  { }




  fetchVideos(): Observable<Video[]> {
    return this.http.get<Video[]>('http://127.0.0.1:8000/api/videos');
  }

  goVideo(body : any) {
    this.video = body;
    console.log('sei nel video ', this.video.id);
      this.router.navigateByUrl(`/video?video_id=${this.video.id}`);
   }

   getVideo(): Observable<Video> {
    return this.route.queryParams.pipe(
    switchMap(params => {
    const video_id = params['video_id'];
    if (video_id) {
    return this.http.get<Video>(`http://127.0.0.1:8000/api/videos/${video_id}`);
    } else {
    throw new Error('video_id parameter is missing from the URL');
    }
    })
    );
   }


   filterVideo(ricerca: string): Observable<Video[]> {
    const params = new HttpParams().set('titleOrTag', ricerca);
    return this.http.get<Video[]>('http://127.0.0.1:8000/api/videos/filterVideo', { params })
      .pipe(
        catchError((error: any) => {
          if (error.status === 401) {
            return throwError('Unauthorized');
          } else if (error.status === 403) {
            return throwError('Video non trovato');
          } else {
            return throwError('An error occurred');
          }
        })
      );
  }





  sanitizeVideoUrl(videoUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
}
