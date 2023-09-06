import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
import AppConfig from '../../../layout/AppConfig';

const Appointment = () => {
    let emptyProduct = {
        id: null,
        sl: 0,
        date1:'',
        doctor: '',
        specialist: '',
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
        status: 'Not Updated'
    };

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

    const [productDialog, setProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
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

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        console.log("PPPP1",product)

        if(product.name && product.chamber && product.doctor && product.date1 && product.time1 && product.phone) {
            ProductService.postPatientC(
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
            ).then(() => {
                setTogleRefresh(!toggleRefresh);
                setProductDialog(false);
            })
        }
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
            return;
        }

        if(name == 'chamber') {
            const newAvail = masterAvailable?.filter(item => item.chamber == _product.chamber && item.is_active == '1');
            setMsAvailable(newAvail);
        }

        if(name == "doctor") {
            let newAvail = msAvailable?.filter(item => item.dname == e.value);
            setMsAvailable(newAvail);
        }

        if(name == "specialist") {
            const doctors = masterDoctor?.filter(item => item.specialist == e.value)?.map(item => item.name);
            let newAvail = msAvailable?.filter(item => doctors?.includes(item.dname));
            console.log({newAvail})

            setMsAvailable(newAvail);
        }
    }

    console.log("masterDocto", masterDoctor);
    console.log('masterSpecialist', masterSpecialist);

    const onDateChange = (e, name) => {
        let _product = {...product };
        _product[`${name}`] = e.value;
        setProduct(_product);

        const test = e.value.toString();
        setTimeHook(test.slice(0, 3));

        console.log('selectionDate: ', 'name', test, 'selection', e.value, 'product', _product)
    }
    

    // const masterDoctorFiltered = msAvailable?.filter((flag) => flag.is_active == '1');

    console.log('msAvailable---', msAvailable)

    
    // const filTimeList = timeList?.filter(item => item.lebel);

    // console.log("TimeList", mapedTimeList)

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
        // console.log('AVAIL OBJ', availObj);
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

    // console.log("MAIN Time", mainTime);

    // console.log("masterAvailAble-------", masterAvailable);
    console.log("DOCTOR Name: ", checkDoctor);
    console.log("Specialist Name: ", checkSpecial);
    console.log("Chamber Name: ", checkChamber);

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

    // console.log("TimeOOOOOBBBBJ", timeObj);

    const genderList = [
        { label: 'Male', value: 'male'},
        { label: 'Female', value: 'female'},
    ];


    let serial_Range;
    if(checkChamber == null) {
        serial_Range = 100;
    } else {
        serial_Range = 10;
    }

    console.log('masterChamber-----------', msAvailable)

    const numArr = Array.from({ length: serial_Range}, (_, index) => index + 1);

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
            </React.Fragment>
        );
    };


    const topHeader = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                <h2 className="m-0">Nitto Digital Appointment</h2>
                </div>
            </React.Fragment>
        );
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    

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

                    <Dialog
                        visible={productDialog}
                        style={{ width: "600px" }}
                        header="Patient Details"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
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
                    </Dialog>                    
                </div>
            </div>
        </div>
    );
};


Appointment.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};

export default Appointment;
