import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PusherService } from '../Services/pusher.service';
import { FormBuilder, FormGroup } from '@angular/forms';

declare const feather: any;
export interface Message {
  comment: string;
  name: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;


  constructor(private pusherService: PusherService,
    private formBuilder: FormBuilder,) { }

  @Output() onSendMessage: EventEmitter<Message> = new EventEmitter();

  message = {
    name: '',
    comment: '',
  };

  ngOnInit() {
    this.messageForm = this.formBuilder.group({
      name: localStorage.getItem('username'),
      comment: '',
    });
    feather.replace();
  }


  sendMessage() {

    let userId = localStorage.getItem('pinged');
    this.pusherService.comment(this.messageForm.value, userId).subscribe((res: Message) => {
      if(res){
        this.onSendMessage.emit(res);
        this.message = {
          name: '',
          comment: '',
        };

        window.location.reload();

      }

  

    });

  }

}
