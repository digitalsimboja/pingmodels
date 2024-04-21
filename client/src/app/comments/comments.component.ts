import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthServiceService } from '../Services/auth-service.service';
import { Message } from '../models/message';
import { PusherService } from '../Services/pusher.service';
import { FormBuilder, FormGroup } from '@angular/forms';


declare const feather: any;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  public pinged = false;
  messageForm: FormGroup;
  message: Message;
    name = '';
    text = '';
  

  constructor(
    private AuthService: AuthServiceService,
    private formBuilder: FormBuilder,
    private pusher: PusherService) { }

    @Output() onSendMessage: EventEmitter<Message> = new EventEmitter();
    user = localStorage.getItem('username')
    
  

    ngOnInit(): void {
      if (localStorage.getItem('pinged')) {
        this.pinged = true;
      }
      feather.replace();

      this.messageForm = this.formBuilder.group({
        name: [this.user],
        text: '',
      });
    }
  
    /*
  sendMessage() {
    if (this.messageForm.value !== null || '')  {
      let photoId = localStorage.getItem('pinged');
      this.pusher.comment(this.messageForm.value, photoId).subscribe((res: Message) => {
        console.log('received message');
        this.onSendMessage.emit(res);
          this.name= '';
          this.text = '';
        
      });
    }

  }

*/
}
