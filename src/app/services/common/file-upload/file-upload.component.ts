import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../httpclient.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService) { }

  public files: NgxFileDropEntry[];
  
  @Input() options: Partial<UploadFileOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }

    this.httpClientService.post({
      controller: this.options.controller,
      action: this.options.action,
      queryString: this.options.queryString
    }, fileData).subscribe(data => {

      const successMessage: string = "Files are uploaded successfully.";

      if (this.options.isAdminPage) {
        this.alertifyService.message(successMessage, {
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });
      } else {

        this.customToastrService.message(successMessage, "Fail", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        
      }
    }, (errorResponse: HttpErrorResponse) => {

      const errorMessage: string = "Files are not uploaded due to some reasons.";

      if (this.options.isAdminPage) {
        this.alertifyService.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      } else {
        this.customToastrService.message(errorMessage, "Error",{
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
    });
  }

}

export class UploadFileOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  accept?: string;
  explanation?: string;
  isAdminPage?: boolean = false;
}
