import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Video } from '../interfaces/video';
import { Observable, Subject, catchError, of, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class VideoService {
  idA : number
  video = {
    id:0,
    titolo: '',
    descrizione: '',
    utente_username: '',
    linkvideo: ''
  }
  errorMessage$ = new Subject<string>();
  likeBody = {

  }



  constructor(private http : HttpClient,
    private router: Router,
    private sanitizer : DomSanitizer,
    private route: ActivatedRoute
  )
  {
    this.idA = 0
  }




  fetchVideos(page: number): Observable<Video[]> {
    return this.http.get<Video[]>('http://127.0.0.1:8000/api/videos',{
    params: {
      page: page
    }});
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
    this.idA = video_id

    if (video_id) {
    return this.http.get<Video>(`http://127.0.0.1:8000/api/videos/${video_id}`);
    } else {
    throw new Error('video_id parameter is missing from the URL');
    }
    })
    );
   }

    sortVideos(utente_id: number, page: number) {
    return this.http.get<Video[]>('http://127.0.0.1:8000/api/videos/sorted/sort', {
      params: {
        utente_id: utente_id,
        page: page
      }
    })
  }


   filterVideo( page: number): Observable<Video[]> {

    return this.route.queryParams.pipe(
    switchMap(params => {
    const Search = params['cerca'];

    console.log(Search)
    if (Search) {
      console.log('chiamata partita')
      return this.http.get<Video[]>(`http://127.0.0.1:8000/api/videos/sorted/search?searchTerm=${Search}&page=${page}`);
    } else {
      console.log('chiamata non partita')
      throw new Error('Search parameter is missing from the URL');
    }
  })
);

  }

  makeLikeBody(idUtente : number, idVideo : number) {
    return this.likeBody = {
      utente_id : idUtente,
      video_id : idVideo,
    }
  }


async addLike(idUtente : number, idVideo : number) {
    const body = this.makeLikeBody(idUtente, idVideo)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    console.log('questo è il body di addLike', body)
    return this.http.post<any>('http://127.0.0.1:8000/api/videos/addLike', body, options)
    .pipe(
      tap({
        error: (error) => {
          var check = error.status;
          let errorMessage = error.error.error;
          this.errorMessage$.next(errorMessage);
        },
      })
    )
  }


  async removeLike(idUtente : number, idVideo : number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };

    const body = this.makeLikeBody(idUtente, idVideo)
    return this.http.post<any>('http://127.0.0.1:8000/api/videos/removeLike', body, options)
    .pipe(
      tap({
        error: (error) => {
          let errorMessage = error.error.error;
          console.log(errorMessage);
          this.errorMessage$.next(errorMessage);
        },
      })
    )
  }



  fetchLikes(utente_id: number): Observable<{ UtenteLiked: boolean; likes: number }> {
    console.log('id utente', utente_id);
    return this.route.queryParams.pipe(
      switchMap(params => {
        const id = params['video_id'];
        if (id) {
          return this.http.get<{ UtenteLiked: boolean; likes: number }>(`http://127.0.0.1:8000/api/videos/fetchlikes/${id}?utente_id=${utente_id}`);
        } else {
          throw new Error('video_idparameter is missing from the URL');
        }
      })
    );
  }


  fetchViews(id1: number): Observable<any> {
        return this.route.queryParams.pipe(
          switchMap(params => {
          const id= params['video_id'];
          if (id) {
           return this.http.get<number>(`http://127.0.0.1:8000/api/videos/fetchViews/${id}`);
          } else {
          throw new Error('video_idparameter is missing from the URL');
          }
          })
          );
        }





  sanitizeVideoUrl(videoUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }


async addView(body : any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    console.log('questo è il body view:', body)
    return this.http.post<any>('http://127.0.0.1:8000/api/videos/addView', body, options)
    .pipe(
      tap({
        error: (error) => {
          var check = error.status;
          let errorMessage = error.error.error;
          console.log(errorMessage);
          this.errorMessage$.next(errorMessage);
        },
      })
    )
    .subscribe({
      next: (Response) => {
        console.log('Response:', Response);
      },
    });
}
Upload(body: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const options = { headers: headers };
  console.log('questo è il body view:', body)
  return this.http.post<any>('http://127.0.0.1:8000/api/videos/store', body, options)
    .pipe(
      tap({
        error: (error) => {
          let errorMessage = error.error.error;
          console.log(errorMessage);
          this.errorMessage$.next(errorMessage);
        },
      })
    );
}
fetchVideosByVideoId(page: number): Observable<Video[]> {
  const video_id = this.route.snapshot.queryParams['video_id'];
  return this.http.get<Video[]>(`http://127.0.0.1:8000/api/videos/sorted/consigliati`, {
    params: {
      video_id: video_id,
      page: page
    }
  });
}
formatNumber(num: number): string {
  if( num!==null){
    if (num >= 1e9) {
      const formattedNum = (num / 1e9).toFixed(1);
      return formattedNum.endsWith('.0') ? formattedNum.slice(0, -2) + 'Mld' : formattedNum + 'Mld';
    } else if (num >= 1e6) {
      const formattedNum = (num / 1e6).toFixed(1);
      return formattedNum.endsWith('.0') ? formattedNum.slice(0, -2) + 'Mln' : formattedNum + 'Mln';
    } else {
      return num.toLocaleString();
    }
  }
  else
  {
    return '';
  }

}

getTimeSince(dateString: string): string {
  const now = new Date();
  const dateObject = new Date(dateString);
  const diff = now.getTime() - dateObject.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} ann${years > 1 ? 'i' : 'o'} fa`;
  } else if (months > 0) {
    return `${months} mes${months > 1 ? 'i' : 'e'} fa`;
  } else if (days > 0) {
    return `${days} giorn${days > 1 ? 'i' : 'o'} fa`;
  } else if (hours > 0) {
    return `${hours} or${hours > 1 ? 'e' : 'a'} fa`;
  } else if (minutes > 0) {
    return `${minutes} minut${minutes > 1 ? 'i' : 'o'} fa`;
  } else {
    return `${seconds} second${seconds > 1 ? 'i' : 'o'} fa`;
  }
}

}
