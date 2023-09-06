import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
import { getJWT, getUserName } from '../../../utils/utils';


const Appointment = () => {
    const router = useRouter();

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
        datepic: '',
        time1:'',
        chamber: '',
        image: null,
        category: null,
        price: 0,
        details: '',
        status: 'SUCCESS'
    };

    const [products, setProducts] = useState([]);
    const [allPatient, setAllPatient] = useState(null);
    const [masterAvail, setMasterAvail] = useState(null);
    const [jwtUser, setJWTUser] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
    const [masterChamber, setMasterChamber] = useState(null);
    const [masterOperate, setMasterOperate] = useState(null);
    const [masterSpecialist, setMasterSpecialist] = useState(null);
    const [masterDoctor, setMasterDoctor] = useState(null);
    const [masterTime, setMasterTime] = useState(null);
    const [timeHook, setTimeHook] = useState(null);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [toggleRefresh, setTogleRefresh] = useState(false);

    const timeObj = [];
  

    useEffect(() => {
        const jwtToken = getJWT();
        const user = getUserName();
        
        if (!jwtToken) {
            return window.location = '/'
        }

        setJwtToken(jwtToken);
        setJWTUser(user)
     }, [])

    useEffect(() => {
        if (!jwtToken) {
            return;
        }
        ProductService.getProducts(jwtToken).then((data) => setAllPatient(data));

        ProductService.getChamber().then((data) => setMasterChamber(data));
        ProductService.getSpecialist().then((data) => setMasterSpecialist(data));
        ProductService.getDoctor().then((data) => setMasterDoctor(data));
        ProductService.getTime().then((data) => setMasterTime(data));
        ProductService.getOperator().then((data) => setMasterOperate(data));
        ProductService.getAvailable().then((data) => setMasterAvail(data));

        // setProduct({
        //     ...emptyProduct,
        //     specialist: 'Gyne & Obs',
        //     chamber: 'Chamber-A'
        // })

    }, [jwtToken, toggleRefresh]);

    const openNew = () => {
        // setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        // console.log("PPPP1",product)

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
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
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
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

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
    }

    const onDateChange = (e, name) => {
        let _product = {...product };
        _product[`${name}`] = e.value;
        setProduct(_product);

        const test = e.value.toString();

        setTimeHook(test.slice(0,3));

        console.log('selection: ', 'name', name, 'selection', e.value, 'product', _product);

    
    }

    const fitleredData = masterOperate?.filter(item => item.userName == jwtUser);
    const Doctor = fitleredData?.map(item => item.dr_name).toString()
    // console.log("UserName", jwtUser);
    // console.log("MasterOperate", masterOperate)
    // console.log("FiterData", fitleredData)
    // console.log('mapedData', Doctor)

    const filProduct = allPatient?.filter((item) => item.doctor == Doctor);

    const masterChamberFiltered = masterAvail?.filter((item) => item.dname == Doctor);    
    const chamberList = masterChamberFiltered?.map((item) => {
        return {  label: item.chamber, value: item.chamber }
    })

    // console.log("masterChamberFiltered", masterChamberFiltered)
    // console.log('masterAvail', masterAvail);

    const masterSpecialistFiltered = masterDoctor?.filter((item) => item.is_active == '1' && item.name == Doctor); 
    const specialistList = masterSpecialistFiltered?.map((item) => {
        return { label: item.specialist, value: item.specialist }
    })

    // const masterDoctorFiltered = masterDoctor?.filter((flag) => flag.is_active == '1');
    // const doctorList = masterDoctorFiltered?.map((item) => {
    //     return { label: item.name, value: item.name }
    // })

    const doctorList = [
        { label: Doctor, value: Doctor},
        
    ];

    const masterTimeFiltered = masterTime?.filter((flag) => flag.is_active == '1');
    const timeList1 = masterTimeFiltered?.map((item) => {
        return {  
            label: [`${item.st_time} - ${item.en_time}` ], 
            value: [`${item.st_time} - ${item.en_time}` ],
        }
     })

    

     console.log("TimeHook", timeHook);
     
     const timeFiltered = masterAvail?.filter(item => item.dname == Doctor);
     const mapTime = timeFiltered?.map(item => {
        timeObj.Sat = item.saturdayT;
        timeObj.Sun = item.sundayT;
        timeObj.Mon = item.mondayT;
        timeObj.Tue = item.tuesdayT;
        timeObj.Wed = item.wednesdayT;
        timeObj.Thu = item.thursdayT;
        timeObj.Fri = item.fridayT;
     })

     let timeList = [];
     if(timeHook == 'Sat') {
        timeList = [
            {label: [`${timeObj.Sat}`], value: `${timeObj.Sat}`}
        ]
     } else if(timeHook == 'Sun') {
        timeList = [
            {label: [`${timeObj.Sun}`], value: `${timeObj.Sun}`}
        ]
     }else if(timeHook == 'Mon') {
        timeList = [
            {label: [`${timeObj.Mon}`], value: `${timeObj.Mon}`}
        ]
     }else if(timeHook == 'Tue') {
        timeList = [
            {label: [`${timeObj.Tue}`], value: `${timeObj.Tue}`}
        ]
     }else if(timeHook == 'Wed') {
        timeList = [
            {label: [`${timeObj.Wed}`], value: `${timeObj.Wed}`}
        ]
     }else if(timeHook == 'Thu') {
        timeList = [
            {label: [`${timeObj.Thu}`], value: `${timeObj.Thu}`}
        ]
     }else if(timeHook == 'Fri') {
        timeList = [
            {label: [`${timeObj.Fri}`], value: `${timeObj.Fri}`}
        ]
     }

    //  const fiterTime = timeObj?.filter((item)=> item.timeHook )
    //  const timeList = fiterTime?.map(item => {
    //     return {label: item, value: item}
    //  })

    console.log("Time Object", timeObj[timeHook], timeHook)

    //  const timeList = [
    //     {label: [`${timeObj.Sat}`], value: `${timeObj.timeHook}`}
    //  ];


     console.log("OOOObj", timeObj.Goru)
    
    //  const timeList1 = mapTime?.map(item => {
    //     if(item.timeHook) {
    //         return {
    //             label: item.timeHook,
    //             value: item.timeHook
    //         }
    //     }
    //  })

    //  console.log("timeList1", timeList1);

     

     console.log("timeFiltered", timeFiltered)

    const genderList = [
        { label: 'Male', value: 'male'},
        { label: 'Female', value: 'female'},
    ];


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
        // products.length.map((i) => {
        //     return(
        //         <>{i+1}</>
        //     )
        // })
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
                <span className={`product-badge status-${rowData.status}`}>{rowData.status}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-eye" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                {/* <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteProduct(rowData)} /> */}
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
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    
    
    if(filProduct == null) {
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

    console.log('product', product, product.chamber == '' && product.doctor== '' && product.specialist == '')

    const chamberAuto = chamberList?.map(item => item.label).toString();
    const specialistAuto = specialistList?.map(item => item.label).toString();
    const timeAuto = timeList?.map(item => item.label).toString();

    console.log('timeAuto', timeAuto)


    console.log({product, Doctor, chamberAuto, specialistAuto})
    if (!product.chamber && !product.doctor && !product.specialist && chamberAuto) {

        product.doctor = Doctor
        product.chamber = chamberAuto
        product.specialist = specialistAuto
    
    }

    if(timeAuto){
        product.time1 = timeAuto
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
                        value={filProduct}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Patients"
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
                                    name='spcialist'
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
                                    value={product.date1}
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
                                    options={timeList}
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
                            <InputText
                                id="serial"
                                value={product.serial}
                                onChange={(e) => onInputChange(e, "serial")}
                                required
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

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    
                </div>
            </div>
        </div>
    );
};

export default Appointment;
