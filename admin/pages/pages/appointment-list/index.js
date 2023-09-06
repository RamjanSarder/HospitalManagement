import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from "primereact/checkbox";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';

const Appointment = () => {
    let emptyProduct = {
        id: null,
        sl: 0,
        date1:'',
        doctor: '',
        specialist: '',
        serial: '',
        name: '',
        phone:'',
        age: '',
        gender:'',
        time1:'',
        chamber: '',
        image: null,
        category: null,
        price: 0,
        details: '',
        status: 'Updated'
    };


    let emptyFollo = {
        id: null,
        visit_status: '',
        visit_time:'',
        followUpDate: '',
        image: '',
    }

    const [products, setProducts] = useState(null);
    const [masterChamber, setMasterChamber] = useState(null);
    const [masterSpecialist, setMasterSpecialist] = useState(null);
    const [masterDoctor, setMasterDoctor] = useState(null);
    const [masterTime, setMasterTime] = useState(null);
    const [masterAvailable, setMasterAvailable] = useState(null);
    const [timeHook, setTimeHook] = useState(null)
    const [checkSpecial, setCheckSpecial] = useState(null);
    const [checkDoctor, setCheckDoctor] = useState(null);
    const [checkChamber, setCheckChamber] = useState(null);
    const [msAvailable, setMsAvailable] = useState(null);
    const [followUp, setFollowUp] = useState(null);
    const [checked, setChecked] = useState(false);

    const [productDialog, setProductDialog] = useState(false);

    const [followDialog, setFolloDialog] = useState(false);
    const [follow, setFollow] = useState(emptyFollo);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [light, setLight] = useState(0);
    const [toggleRefresh, setTogleRefresh] = useState(false);

    const timeObj = [];


    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data));
        ProductService.getChamber().then((data) => setMasterChamber(data));
        ProductService.getSpecialist().then((data) => setMasterSpecialist(data));
        ProductService.getDoctor().then((data) => setMasterDoctor(data));
        ProductService.getTime().then((data) => setMasterTime(data));
        ProductService.getAvailable().then((data) => {
            setMsAvailable(data)
            setMasterAvailable(data);
        });
    }, [toggleRefresh]);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const openFollow = () => {
        setFollow(emptyFollo);
        setSubmitted(false);
        setFolloDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideFollowDialog = () => {
        setSubmitted(false);
        setFolloDialog(false);
    };


    const saveProduct = () => {
        setSubmitted(true);

        console.log("PPPP1",product)

        console.log("Day Wise Date",product.date1);

        if(product.name && product.chamber && product.doctor && product.date1 && product.time1 && product.serial && product.age && product.gender && product.phone && product.details && product._id) {
            ProductService.editPatient(
                product.chamber,
                product.specialist,
                product.doctor,
                product.date1,
                product.time1,
                product.name,
                product.age,
                product.gender,
                product.phone,
                product.details,
                product.serial,
                product._id
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient is Updated', life: 3000 });
            })
        } else if(product.name && product.chamber && product.doctor && product.date1 && product.time1 && product.serial) {
            ProductService.postPatient(
                product.chamber,
                product.specialist,
                product.doctor,
                product.date1,
                product.time1,
                product.name,
                product.age,
                product.gender,
                product.phone,
                product.details,
                product.serial,
                product.status,
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Patient is Created', life: 3000 });
            })
        }
    };


    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        setFolloDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onFollowChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _follow = {...follow};
        _follow[`${name}`] = val;

        setFollow(_follow);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onSelectionChange = (e, name) => {
        let _product = {...product };
        _product[`${name}`] = e.value;
        setProduct(_product);

        if(name == 'chamber' ) {
            setCheckChamber(e.value);
        }
        if(name == 'doctor') {
            setCheckDoctor(e.value);
        }
        if(name == 'specialist'){
            setCheckSpecial(e.value);
        }

        console.log('selection: ', 'name', name, 'selection', e.value, 'product', _product);
        
        if (e.value == undefined) {
            let newAvail = masterAvailable?.filter(item => item.is_active == '1');

            if (_product.chamber) {
                newAvail = newAvail?.filter(item => item.chamber == _product.chamber);
            }

            if (_product.doctor) {
                newAvail = newAvail?.filter(item => item.dname == _product.doctor);
            }

            if (_product.specialist) {
                const doctors = masterDoctor?.filter(item => item.specialist == _product.specialist)?.map(item => item.name);
                newAvail = newAvail?.filter(item => doctors?.includes(item.dname));
            }

            setMsAvailable(newAvail) ;
            setLight(1);
            return;
        }

        if(name == 'chamber') {
            const newAvail = masterAvailable?.filter(item => item.chamber == _product.chamber && item.is_active == '1');
            setMsAvailable(newAvail);
            setLight(1);
        }

        if(name == "doctor") {
            let newAvail = msAvailable?.filter(item => item.dname == e.value);
            setMsAvailable(newAvail);
            setLight(1)
        }

        if(name == "specialist") {
            const doctors = masterDoctor?.filter(item => item.specialist == e.value)?.map(item => item.name);
            let newAvail = msAvailable?.filter(item => doctors?.includes(item.dname));
            console.log({newAvail})

            setMsAvailable(newAvail);
            setLight(1)
        }
    }

    const onDateChange = (e, name) => {
        let _product = {...product };
        _product[`${name}`] = e.value;
        setProduct(_product);

        const test = e.value.toString();
        setTimeHook(test.slice(0, 3));

        console.log('selectionDate: ', 'name', test, 'typeOf', typeof e.value, 'selection', e.value, 'product', _product)
    }

    let doctorList;
    let specialistList;
    let chamberList;
    let timeList1;

    if(msAvailable == null) {


        const masterChamberFiltered = masterChamber?.filter((item) => item.is_active == '1');    
        chamberList = masterChamberFiltered?.map((item) => {
            return {  label: item.chamber, value: item.chamber }
        })

        const masterDoctorFiltered = masterDoctor?.filter((item) => item.is_active == '1');
        doctorList = masterDoctorFiltered?.map((item) => {
            return { label: item.name, value: item.name }
        })

        const masterSpecialistFiltered = masterSpecialist?.filter((item) => item.is_active == '1'); 
        specialistList = masterSpecialistFiltered?.map((item) => {
            return { label: item.specialist, value: item.specialist }
        })
        
    } else {
    
        const chambers = msAvailable?.map((item) =>  item.chamber);
        const masterChamberFiltered = masterChamber?.filter((item) => chambers?.includes(item.chamber) && item.is_active == '1');    
        
        chamberList = masterChamberFiltered?.map((item) => {
            return {  label: item.chamber, value: item.chamber }
        })

        const doctors = msAvailable?.map((item) =>  item.dname);
        const masterDoctorFiltered = masterDoctor?.filter((item) => doctors?.includes(item.name) && item.is_active == '1');

        doctorList = masterDoctorFiltered?.map((item) => {
            return { label: item.name, value: item.name }
        })

        specialistList = masterDoctorFiltered?.map((item) => {
            return { label: item.specialist, value: item.specialist }
        })
        
    }

    let availObj;
    if(checkDoctor != null) {
        availObj = masterAvailable?.filter(item => item.dname == checkDoctor);

        availObj?.map(item => {
            timeObj.Sat = item.saturdayT;
            timeObj.Sun = item.sundayT;
            timeObj.Mon = item.mondayT;
            timeObj.Tue = item.tuesdayT;
            timeObj.Wed = item.wednesdayT;
            timeObj.Thu = item.thursdayT;
            timeObj.Fri = item.fridayT;
        })
    }
    if(checkChamber != null) {
        availObj = masterAvailable?.filter(item => item.chamber == checkChamber);

        availObj?.map(item => {
            timeObj.Sat = item.saturdayT;
            timeObj.Sun = item.sundayT;
            timeObj.Mon = item.mondayT;
            timeObj.Tue = item.tuesdayT;
            timeObj.Wed = item.wednesdayT;
            timeObj.Thu = item.thursdayT;
            timeObj.Fri = item.fridayT;
        })
    }

    if(checkSpecial != null ) {
        const specialistOne = masterDoctor?.filter(item => item.specialist == checkSpecial);
        const doctorSp = specialistOne?.map(item => item.name).toString()

        availObj = masterAvailable?.filter(item => item.dname == doctorSp);

        availObj?.map(item => {
            timeObj.Sat = item.saturdayT;
            timeObj.Sun = item.sundayT;
            timeObj.Mon = item.mondayT;
            timeObj.Tue = item.tuesdayT;
            timeObj.Wed = item.wednesdayT;
            timeObj.Thu = item.thursdayT;
            timeObj.Fri = item.fridayT;
        })
    }


    let mainTime;
    if(timeHook == 'Sat') {
        mainTime = masterAvailable?.map(item => item.saturdayT);
    }
    if(timeHook == 'Sun') {
        mainTime = masterAvailable?.map(item => item.sundayT);
    }
    if(timeHook == 'Mon') {
        mainTime = masterAvailable?.map(item => item.mondayT);
    }
    if(timeHook == 'Tue') {
        mainTime = masterAvailable?.map(item => item.tuesdayT);
    }
    if(timeHook == 'Wed') {
        mainTime = masterAvailable?.map(item => item.wednesdayT);
    }
    if(timeHook == 'Thu') {
        mainTime = masterAvailable?.map(item => item.thursdayT);
    }
    if(timeHook == 'Fri') {
        mainTime = masterAvailable?.map(item => item.fridayT);
    }

    const masterTimeFiltered = masterTime?.filter((flag) => flag.is_active == '1');
    const timeList = masterTimeFiltered?.map((item) => {
        return {  
            label: [`${item.st_time} - ${item.en_time}` ], 
            value: [`${item.st_time} - ${item.en_time}` ],
        }
    })

    if(timeHook == null) {
        timeList1 = timeList?.map(item => {
            return {label: item.label, value: item.label}
        });
    } 

    else  if(timeHook != null && checkSpecial == null && checkDoctor == null && checkChamber == null) {
        timeList1 = mainTime?.map(item => {
            return {label: item, value: item}
        })
    }
    else {
        timeList1 = [
            {label: timeObj[timeHook], value: timeObj[timeHook]}
        ]
    }

    const genderList = [
        { label: 'Male', value: 'male'},
        { label: 'Female', value: 'female'},
    ];



    let msSerila = 0;
    if(light == 1) {
        msSerila = msAvailable?.map(item => item.serial-0)
        msSerila = Math.max(...msSerila);

    } else if(masterAvailable != undefined){
        msSerila = masterAvailable?.map(item => item.serial-0);
        msSerila = Math.max(...msSerila);

    }

    const numArr = Array.from({ length: msSerila}, (_, index) => index + 1);

    const serialList = numArr.map(item => {
        return {label: item, value: item}
    })


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Add Appointment"
                    icon="pi pi-plus"
                    severity="sucess"
                    className="mr-2"
                    onClick={openNew}
                />
                <Button
                    label="Download list"
                    icon="pi pi-download"
                    severity="help"
                    onClick={exportCSV}
                />
            </React.Fragment>
        );
    };

    const fn =()=> {
        codeBodyTemplate();
    }

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.sll}
            </>
        
           )
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    }

    const appointDateBodyTemplete = (rowData) => {
        return (
            <>
                <span className="p-column-title">Appointment Date</span>
                   {rowData.date1.slice(0, 10)}
                
            </>
        );
    }

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const serialBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Serial Number</span>
                {rowData.serial}
            </>
        );
    }

    const problemBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Problem</span>
                {rowData.details}
            </>
        );
    }

    const chamberBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Chamber</span>
                {rowData.chamber}
            </>
        );
    }

    const dateBodyTemplete = () => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {rowData.date1}
            </>
        )
    }

    const timeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Time</span>
                {rowData.time1}
            </>
        );
    }
    
    const genderBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Gender</span>
                {rowData.gender}
            </>
        );
    }


    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.status}`} >{rowData.status}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-eye" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-pencil" severity="success" rounded onClick={openFollow} />
            </>
        );
    };

    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                <h2 className="m-0">Appointment List</h2>
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const followDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideFollowDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    
    
    if(products == null) {
        return (
            <div className="card">
            <div className="border-round border-1 surface-border p-4 surface-card">
                <div className="flex mb-3">
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="570px"></Skeleton>
                <div className="flex justify-content-between mt-3">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>
        )
    }



    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar
                        className="mb-4"
                        left={topHeader}
                        right={rightToolbarTemplate}
                    ></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="Not found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        {/* <Column
                            field="sl"
                            header="SL"
                            body={codeBodyTemplate}
                            sortable
                        ></Column> */}
                        <Column
                            field="date1"
                            header="Appointment Date"
                            sortable
                            body={appointDateBodyTemplete}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="serial"
                            header="Serial Number"
                            body={serialBodyTemplate}
                        ></Column>
                        <Column
                            field="name"
                            header="Name"
                            sortable
                            body={nameBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                        <Column
                            field="phone"
                            header="Phone"
                            body={phoneBodyTemplate}
                        ></Column>
                        <Column
                            field="gender"
                            header="Gender"
                            sortable
                            body={genderBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="time1"
                            header="Time"
                            body={timeBodyTemplate}
                            headerStyle={{ minWidth: "3rem" }}
                        ></Column>
                        <Column
                            field="chamber"
                            header="Chamber"
                            sortable
                            body={chamberBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="details"
                            header="Problem"
                            body={problemBodyTemplate}
                            headerStyle={{ minWidth: "5rem" }}
                        ></Column>
                        <Column
                            field="status"
                            header="Status"
                            body={statusBodyTemplate}
                            sortable
                            headerStyle={{ minWidth: "5rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            headerStyle={{ minWidth: "2rem" }}
                        ></Column>
                    </DataTable>

                    <Dialog
                        visible={productDialog}
                        style={{ width: "600px" }}
                        header="Patient Details"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                        {/* {product.image && (
                            <img
                                src={`/demo/images/product/${product.image}`}
                                alt={product.image}
                                width="150"
                                className="mt-0 mx-auto mb-5 block shadow-2"
                            />
                        )} */}
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="chamber">Chamber</label>
                                <Dropdown
                                    value={product.chamber}
                                    name='chamber'
                                    onChange={(e) => onSelectionChange(e, "chamber")}
                                    options={chamberList}
                                    optionLabel="value"
                                    showClear
                                    placeholder="Select a Chamber"
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !product.chamber,
                                    })}
                                />
                                </div>
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Chamber is required.
                                    </small>
                                )}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="specialist">Specialization</label>
                                <Dropdown
                                    value={product.specialist}
                                    name='specialist'
                                    onChange={(e) => onSelectionChange(e, "specialist")}
                                    options={specialistList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Specialization"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.specialist,
                                    })}
                                />
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Specialization is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="doctor">Doctor</label>
                                <Dropdown
                                    value={product.doctor}
                                    name='doctor'
                                    onChange={(e) => onSelectionChange(e, "doctor")}
                                    options={doctorList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Doctor"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.doctor,
                                    })}
                                />
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Doctor is required.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="date1">Date</label>
                                <Calendar 
                                    value={(product.date1)}
                                    name='date1' 
                                    onChange={(e) => onDateChange(e, "date1")} 
                                    dateFormat="dd/mm/yy" 
                                    placeholder="Select a Date"
                                    required
                                    showIcon
                                    className={classNames({
                                        "p-invalid": submitted && !product.date1,
                                    })}
                                />
                                {submitted && !product.date1 && (
                                    <small className="p-invalid">
                                        Date is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="time1">Time</label>
                                <Dropdown
                                    value={product.time1}
                                    name='time1'
                                    onChange={(e) => onSelectionChange(e, "time1")}
                                    options={timeList1}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Time"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.time1,
                                    })}
                                />
                                {submitted && !product.chamber && (
                                    <small className="p-invalid">
                                        Time is required.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Name</label>
                                <InputText
                                    id="name"
                                    value={product.name}
                                    onChange={(e) => onInputChange(e, "name")}
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !product.name,
                                    })}
                                />
                                {submitted && !product.name && (
                                    <small className="p-invalid">
                                        Name is required.
                                    </small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="age">Age</label>
                                <InputText
                                    id="age"
                                    value={product.age}
                                    onChange={(e) => onInputChange(e, "age")}
                                />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="gender">Gender</label>
                                <Dropdown
                                    value={product.gender}
                                    name='gender'
                                    onChange={(e) => onSelectionChange(e, "gender")}
                                    options={genderList}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Gender"
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="phone">Phone</label>
                                <InputText
                                    id="phone"
                                    value={product.phone}
                                    onChange={(e) => onInputChange(e, "phone")}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="details">Details</label>
                            <InputTextarea
                                id="details"
                                value={product.details}
                                onChange={(e) =>
                                    onInputChange(e, "details")
                                }
                                required
                                rows={3}
                                cols={20}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="serial">Add Serial Number</label>
                            <Dropdown 
                                value={Number(product.serial)} 
                                name='serial'
                                onChange={(e) => onSelectionChange(e, "serial")} 
                                options={serialList} 
                                optionLabel="label" 
                                placeholder="Select a Serial Number" 
                                className={classNames({
                                    "p-invalid": submitted && !product.serial,
                                })}
                            />
                            {submitted && !product.serial && (
                                <small className="p-invalid">
                                    Serial Number is required.
                                </small>
                            )}
                        </div>
                    </Dialog>

                    {/* <Dialog visible={followDialog} style={{ width: '600px' }} header="Confirm" modal footer={followDialogFooter} onHide={hideFollowDialog}>
                        
                    </Dialog> */}
                    <Dialog
                        visible={followDialog}
                        style={{ width: "550px" }}
                        header="Follow-Up-Date"
                        modal
                        className="p-fluid"
                        footer={followDialogFooter}
                        onHide={hideFollowDialog}
                    >
                        {/* {product.image && (
                            <img
                                src={`/demo/images/product/${product.image}`}
                                alt={product.image}
                                width="150"
                                className="mt-0 mx-auto mb-5 block shadow-2"
                            />
                        )} */}

                        <div className="formgrid grid">
                            <div className="card flex justify-content-center gap-3">
                                    <label htmlFor="age">Visit Status</label> 
                                    <Checkbox onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
                            </div>
                            <div className="field col">
                            <label htmlFor="chamber">Payment</label>
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">৳</span>
                                    <InputNumber placeholder="Price" />
                                    <span className="p-inputgroup-addon">/=</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="date1">Follow Up Date</label>
                                <Calendar 
                                    value={(follow.followUpDate)}
                                    name='followUpDate' 
                                    onChange={(e) => onFollowChange(e, "followUpDate")} 
                                    dateFormat="dd/mm/yy" 
                                    placeholder="Select a Date"
                                    required
                                    showIcon
                                    className={classNames({
                                        "p-invalid": submitted && !follow.followUpDate,
                                    })}
                                />
                                {submitted && !follow.followUpDate && (
                                    <small className="p-invalid">
                                        Follow Up Date is required.
                                    </small>
                                )}
                            </div>
                            
                            <div className="field col">
                                <label htmlFor="time1">Time to Visit</label>
                                <Dropdown
                                    value={follow.visit_time}
                                    name='time1'
                                    onChange={(e) => onFollowChange(e, "visit_time")}
                                    options={timeList1}
                                    optionLabel="label"
                                    showClear
                                    placeholder="Select a Time"
                                    required
                                    className={classNames({
                                        "p-invalid": submitted && !follow.visit_time,
                                    })}
                                />
                                {submitted && !follow.visit_time && (
                                    <small className="p-invalid">
                                        Visit Time is required.
                                    </small>
                                )}
                            </div>
                        </div>
                        <div className="field col">
                                <label htmlFor="time1">Add Atachment</label>
                                <FileUpload required mode="basic" accept="image/*" maxFileSize={1000000} customUpload auto uploadHandler={(e)=> { 
                                    setFile(e.files[0]) 
                                }} 
                                    label="Add" chooseLabel="Add" 
                                />
                                
                            </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default Appointment;
