import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadFileOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { Create_Product } from '../../../../contracts/create_product';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { ProductService } from '../../../../services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(private productService: ProductService, spinner: NgxSpinnerService, private alertify: AlertifyService)
  {
    super(spinner);
  }

  ngOnInit(): void {
  }

  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();
  @Output() uploadFileOptions: Partial<UploadFileOptions> = {
    action: "upload",
    controller: "products",
    explanation: "Drag and drop images",
    isAdminPage: true,
    accept: ".png, .jpg, .jpeg"
  };

  create(name: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement) {
    this.showSpinner(SpinnerType.BallClipRotateMultiple);
    const create_product: Create_Product = new Create_Product();

    create_product.name = name.value;
    create_product.stock = parseInt(stock.value);
    create_product.price = parseFloat(price.value);

    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallClipRotateMultiple);
      this.alertify.message("Product is added successfully.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });

      this.createdProduct.emit(create_product);
    }, errorMessage => {
      this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      })
    });
  }

}
