// @ts-nocheck
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SortEventArgs } from '@syncfusion/ej2-grids';
import { ChangeEventArgs, DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import {
  ColumnChooserService,
  ContextMenuService,
  EditService,
  ExcelExportService,
  PageService,
  PdfExportService,
  ReorderService,
  ResizeService,
  SortService,
  InfiniteScrollService
} from '@syncfusion/ej2-angular-treegrid';
import { EmitType } from '@syncfusion/ej2-base';
import { EditSettingsModel } from '@syncfusion/ej2-treegrid';

import { TreegridService } from '../service/treegrid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    SortService,
    ReorderService,
    ResizeService,
    ColumnChooserService,
    PageService,
    EditService,
    ExcelExportService,
    PdfExportService,
    ContextMenuService,
    InfiniteScrollService
  ],
})

export class AppComponent implements OnInit {
  public contextMenuItems: any = [];
  public editing: EditSettingsModel = {};
  public toolbar: Array<string> = [];
  public editparams: Object = {};
  public copyRow = null;
  public copyRowIndex = null;
  public cellIndex: number;
  public rowIndex: any = null;
  public sortSettings: Object | any = {};
  public currentRowId: any = null;
  public currentIndex: any = null;

  public data: any = [];
  public pageSettings: Object = {};
  public selectionSettings: Object = {};
  public filterSettings: Object = {};
  public filteredData: Object = {};
  public filteredFields: Object = {};
  public columns: Array = [];
  public loading:boolean = false;
  public dropDownFilter: DropDownList = {};
  public rowType = 'row';
  public frozenColumns = 2;
  public hideAddDialog: EmitType<object> = () => {
    this.addRowDialog.hide();
  };

  public deleteColButtons: Object = [
    {
      click: this.hideAddDialog.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
    {
      click: this.hideAddDialog.bind(this),
      buttonModel: {
        content: 'Cancel',
      },
    },
  ];

  public form: FormGroup;

  @ViewChild('addRowDialog') public addRowDialog: any;

  public columnToEdit = '';

  @ViewChild('treegrid') public treeGridObj: any;

  @ViewChild('addColumnDialog') public addColumnDialog: DialogComponent;

  @ViewChild('editColumnDialog') public editColumnDialog: DialogComponent;

  public targetElement: HTMLElement;

  public deleteColTargetElement: HTMLElement;

  public skillForm: FormGroup;

  public editColumnFormGroup: FormGroup;

  @ViewChild('dropdown') public dropdownObject: DropDownListComponent;
  public sportsData: Array<Object> = [
    { key: 'numericedit', value: 'Numeric' },
    { key: 'datepickeredit', value: 'Date' },
    { key: 'stringedit', value: 'String' },
    { key: 'booleanedit', value: 'Boolean' },
  ];
  public textAlignData: Array<Object> = [
    { key: 'Right', value: 'Right' },
    { key: 'Left', value: 'Left' },
  ];
  public fields: Object = { text: 'value', value: 'key' };

  constructor(private readonly fb: FormBuilder, public treegridService: TreegridService) {
    this.addColumnForm();
    this.editColumnForm();
    this.loadData();
  }
  public loadData(){
    this.showSpinner = true;
    this.treegridService.getTreeData()
    .subscribe((data) => {
      this.columns = data.columns;
      this.treeGridObj.dataSource = data.data;
      this.showSpinner =  false;

    });
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      taskName: [null],
      startDate: [null],
      endDate: [null],
      duration: [null],
      progress: [null],
      priority: [null],
      // type: [null],
    });

    // this.data = sampleData;
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    // this.pageSettings = { pageSize: 10 };
    // this.selectionSettings = { type: 'Multiple' };

    this.sortSettings = { columns: [{ field: 'taskID', direction: 'Ascending' }] };

    this.contextMenuItems = [
      { text: 'Edit this column', target: '.e-gridheader', id: 'edit-column' },
      { text: 'Delete this column', target: '.e-gridheader', id: 'delete-column' },
      { text: 'Add new column', target: '.e-gridheader', id: 'add-column' },
      // { text: 'Freeze column', target: '.e-gridheader', id: 'freeze-column' },
      { text: 'Add Next', target: '.e-content', id: 'add-row' },
      { text: 'Add child', target: '.e-content', id: 'add-child-row' },
      { text: 'Edit Row', target: '.e-content', id: 'edit-row' },
      { text: 'Copy As Child', target: '.e-content', id: 'customCopy' },
      { text: 'Copy As Next', target: '.e-content', id: 'customCopy' },
      { text: 'Move As child', target: '.e-content', id: 'customPaste' },
      { text: 'Move As Next', target: '.e-content', id: 'customPasteNext' },
      { text: 'Delete', target: '.e-content', id: 'delete-row' },
      'SortAscending',
      'SortDescending',
      'Save',
      'Cancel',
      'FirstPage',
      'PrevPage',
      'LastPage',
      'NextPage',
    ];
    this.editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: 'Row', newRowPosition: 'Child' };

    this.pageSettings = { pageSize: 10 };
    this.editparams = { params: { format: 'n' } };
    this.toolbar = ['ColumnChooser'];

    this.filteredFields = { text: 'mode', value: 'id' };
    this.filteredData = [
      { id: 'Parent', mode: 'Parent' },
      { id: 'Child', mode: 'Child' },
      { id: 'Both', mode: 'Both' },
      { id: 'None', mode: 'None' },
    ];
  }

  public submitRowData() {
    const data = {
      taskID: "A"+ Math.floor(Math.random() * (99 - 40)) + 40,
      taskName: this.form.controls.taskName.value,
      startDate: this.form.controls.startDate.value,
      endDate: this.form.controls.endDate.value,
      duration: this.form.controls.duration.value,
      progress: this.form.controls.progress.value,
      priority: this.form.controls.priority.value,
      approved: true,
    };
    const index = this.rowIndex ;
    this.addRowDialog.hide();
    this.form.reset();
    this.postData({value: data, index, type: this.rowType });
  }

  public postData(obj){
    if(obj && obj.type == 'row'){
      this.addRow(obj.value);
    }else if(obj && obj.type == 'child'){
      this.addChild(obj.value, obj.index);
    }else if(obj && obj.type == 'edit'){
      this.editRow(obj.value, obj.index);
    }
  }

  public editRow(data, id){
    this.loading =  true;
    this.treegridService.editRow(data,id)
    .subscribe((data) => {
      this.loading =  false;
      this.treeGridObj.dataSource = data.data;
    });
  }
  public addChild(data, id){
    this.loading =  true;
    this.treegridService.addChild(data,id)
    .subscribe((data) => {
      this.loading =  false;
      this.treeGridObj.dataSource = data.data;
    });
  }

  public addRow(data){
    this.loading =  true;
    this.treegridService.addRow(data)
    .subscribe((data) => {
      this.loading =  false;
      this.treeGridObj.dataSource = data.data;
    });
  }

  public deleteRow(data, id){
    this.loading =  true;
    this.treegridService.deleteRow(data,id)
    .subscribe((data) => {
      this.loading =  false;
      this.treeGridObj.dataSource = data.data;
    });
  }

  public updateColumn(data){
    this.loading =  true;
    this.treegridService.updateColumn(data)
    .subscribe((data) => {
      this.columns = data.columns;
      this.treeGridObj.dataSource = data.data;
      this.loading =  false;
    });

    this.treeGridObj.columns = this.columns
    this.treeGridObj.refreshColumns();

  }
  public contextMenuClick(args: any): void {

    switch (args.item.id) {
      case 'add-row': {
        this.rowType = "row";
        this.rowIndex = args.rowInfo.rowData.taskID;
        this.addRowDialog.show();
        break;
      }
      case 'delete-row': {
        const data = args.rowInfo.rowData;
        this.deleteRow(data,args.rowInfo.rowData.taskID )
        break;
      }

      case 'edit-row': {
        this.rowType = "edit";
        this.rowIndex = args.rowInfo.rowData.taskID;
        const data = args.rowInfo.rowData;
        this.form.controls.taskName.setValue(data.taskName);
        this.form.controls.startDate.setValue(data.startDate? this.formatDate(data.startDate): '');
        this.form.controls.endDate.setValue(data.endDate ? this.formatDate(data.endDate): '');
        this.form.controls.duration.setValue(data.duration);
        this.form.controls.progress.setValue(data.progress);
        this.form.controls.priority.setValue(data.priority);
        this.addRowDialog.show();
        break;
      }
      case 'add-child-row': {
        this.rowType = "child";
        this.rowIndex = args.rowInfo.rowData.taskID;
        this.addRowDialog.show();
        break;
      }
      case 'add-column': {
        this.addColumnDialog.show();
        break;
      }
      case 'customCopy': {
        this.copyRow = args.rowInfo.rowData;
        this.treeGridObj.copy();
        break;
      }
      case 'customPaste': {
        if(this.copyRow){
          this.copyRowIndex = args.rowInfo.rowData.taskID;
          this.copyRow.taskID = "A"+ Math.floor(Math.random() * (99 - 40)) + 40;
          this.addChild(this.copyRow,this.copyRowIndex )
        }
        break;
      }
      case 'customPasteNext': {
        if(this.copyRow){
          this.copyRowIndex = args.rowInfo.rowData.taskID;
          this.copyRow.taskID = "A"+ Math.floor(Math.random() * (99 - 40)) + 40;
          this.addRow(this.copyRow)
        }
        break;
      }

      case 'edit-column': {
        this.columnToEdit = args.column.field;
        this.editColumnFormGroup.patchValue({
          name: args.column.headerText,
          type: args.column.editType,
          textAlign: args.column.textAlign,
          width: args.column.width,
          minWidth: args.column.minWidth,
          defaultValue : args.column.defaultValue
        });
        this.editColumnDialog.show();
        break;
      }
      case 'delete-column': {
        this.columns.filter((i: { field: string }, x: any) => {
          if (i.field == args.column.field) {
            this.columns.splice(x, 1);
          }
        });
        this.updateColumn(this.columns);
        break;
      }
      case 'freeze-column':{
    
          this.treeGridObj.getColumnByField(args.column.field).isFrozen = true;  //isFrozen property helps to freeze the columns 
          this.treeGridObj.refreshColumns(); 
        break;
      }
      default: {
        break;
      }
    }
  }

  public onOpenDialog = (event: any): void => {
    this.addColumnDialog.show();
  };

  public onCloseAddNewDialog: EmitType<object> = () => {
    this.skillForm.reset();
    this.addColumnDialog.hide();
  };

  public onSubmitAddNewDialog: EmitType<object> = () => {
    this.onAddNewCol();
    this.skillForm.reset();
    this.addColumnDialog.hide();
  };

  public onOpenEditColumnDialog = (event: any): void => {
    this.editColumnDialog.show();
  };

  public hideDeleteDialog: EmitType<object> = () => {
    this.editColumnDialog.hide();
  };
  public saveEditColumnDialog: EmitType<object> = () => {
    this.onEditCol();
    // this.skillForm.reset();
    this.editColumnDialog.hide();
  };

  public buttons: Object = [
    {
      click: this.onSubmitAddNewDialog.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
    {
      click: this.onCloseAddNewDialog.bind(this),
      buttonModel: {
        content: 'Cancel',
      },
    },
  ];

  public addNewRowbuttons: Object = [
    {
      click: this.submitRowData.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
    {
      click: this.onCloseAddNewRowDialog.bind(this),
      buttonModel: {
        content: 'Cancel',
      },
    },
  ];

  public onCloseAddNewRowDialog() {
    this.form.reset();
    this.addRowDialog.hide();
  }

  public editColButtons: Object = [
    {
      click: this.saveEditColumnDialog.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
    {
      click: this.hideDeleteDialog.bind(this),
      buttonModel: {
        content: 'Cancel',
      },
    },
  ];

  public addColumnForm(): void {
    this.skillForm = this.fb.group({
      name: [null, Validators.required],
      type: [Validators.required],
      defaultValue: [null, Validators.required],
      width: ['200'],
      minWidth: [],
      textAlign: [''],

    });
    
  }

  public editColumnForm(): void {
    this.editColumnFormGroup = this.fb.group({
      name: [null, Validators.required],
      type: [Validators.required],
      defaultValue: [null, Validators.required],
      width: [''],
      minWidth: [''],
      textAlign: [''],
    });
  }

  public onAddNewCol(): void {
    if(this.skillForm.controls.type.value && this.skillForm.controls.name.value){
      this.columns.push({
        field: this.skillForm.controls.name.value,
        headerText: this.skillForm.controls.name.value,
        textAlign: this.skillForm.controls.textAlign.value,
        editType: this.skillForm.controls.type.value,
        width: this.skillForm.controls.width.value,
        minWidth: this.skillForm.controls.minWidth.value,
        defaultValue: this.skillForm.controls.defaultValue.value

      });
      this.updateColumn(this.columns);

    }
  }

  public onEditCol(): void {
    if(this.editColumnFormGroup.controls.type.value && this.editColumnFormGroup.controls.name.value){
      this.columns.forEach((i: { field: string; headerText: string; editType: string }, x: any) => {
        if (i.field == this.columnToEdit) {
          i.headerText = this.editColumnFormGroup.controls.name.value;
          i.editType = this.editColumnFormGroup.controls.type.value;
          i.textAlign = this.editColumnFormGroup.controls.textAlign.value;
          i.width = this.editColumnFormGroup.controls.width.value;
          i.minWidth = this.editColumnFormGroup.controls.minWidth.value;
          i.defaultValue = this.editColumnFormGroup.controls.defaultValue.value

        }
      });
      this.updateColumn(this.columns);
    }
  }

  public change(e: ChangeEventArgs): void {
    const mode: any = <string>e.value;
    this.treeGridObj.filterSettings.hierarchyMode = mode;
    this.treeGridObj.clearFiltering();
    this.dropDownFilter.value = 'All';
  }

  public onClickColum(e: MouseEvent, column: any): void {
    if (e.checked) {
      this.treeGridObj.sortByColumn(column, 'Ascending', true);
    } else {
      this.treeGridObj.grid.removeSortColumn(column);
    }
  }

  formatDate (input) {
    var datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits
    month = datePart[1], day = datePart[2];
    return year+'-'+month+'-'+day;
  }
}
