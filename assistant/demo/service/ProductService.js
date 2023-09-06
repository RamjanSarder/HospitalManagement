import axios from 'axios';

//localhost
//home: 192.168.1.101
//office: 192.168.0.113
// '/demo/data/products.json'
//VM-3    36.255.69.40

const baseUrl = '//localhost:5000';

export const ProductService = {

    // Client and Appointment List
    async postPatient(chamber, specialist, doctor, date1, time1, name, age, gender, phone, details, serial) {

        const data = {
            chamber,
            specialist,
            doctor,
            date1,
            time1,
            name,
            age,
            gender,
            phone,
            details,
            serial,
            status: 'Updated'
        }

        await axios.post(
            `${baseUrl}/client-data`,
            data
        )

    },

    async editPatient(chamber, specialist, doctor, date1, time1, name, age, gender, phone, details, serial, _id) {
        const data = {
            chamber,
            specialist,
            doctor,
            date1,
            time1,
            name,
            age,
            gender,
            phone,
            details,
            serial,
            status: 'Updated'
        }
        await axios.post(`${baseUrl}/edit-patient/` + _id ,
            data
        )
    },

    getProducts(jwtToken) {
        return fetch(`${baseUrl}/get-data`, { 
            headers: { 
                'Cache-Control': 'no-cache',
                'Authorization': jwtToken
            } 
        })
        .then((res) => res.json())
        .then((d) => d.AllData);
    },

    
    //Master Chamber 

    async postChamber(chamber, address) {
        
        const data = {
            chamber,
            address,
        }
        
        const res = await axios.post(
            `${baseUrl}/post-chamber`,
            data
        )
    },

    getChamber() {
        return fetch(`${baseUrl}/get-chamber`, { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => d.AllData);
    },

    async editChamber(chamber, address, _id) {
        const data = {
            chamber,
            address,
        }
        await axios.post(`${baseUrl}/edit-chamber/` + _id ,
            data
        )
    },

    async toggleChamber(is_active, _id) {
        const data = {
            is_active
        }
        await axios.post(`${baseUrl}/toggle-chamber/` + _id ,
            data
        )
    },

    async deleteChember(id) {
        await fetch(`${baseUrl}/delete-chamber/` + id, {
            method: "DELETE"
        })
    },

    
    //Master Time

    async postTime(st_time, en_time) {
        
        const data = {
            st_time,
            en_time
        };  

        const res = await axios.post(
            `${baseUrl}/post-time`,
            data,
        )
    },

    async editTime(st_time, en_time, _id) {
        const data = {
            st_time,
            en_time
        }
        await axios.post(`${baseUrl}/edit-time/` + _id ,
            data
        )
    },

    async toggleTime(is_active, _id) {
        const data = {
            is_active
        }
        await axios.post(`${baseUrl}/toggle-time/` + _id ,
            data
        )
    },

    getTime() {
        return fetch(`${baseUrl}/get-time`, { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => d.AllData);
    },

    async deleteTime(id) {
        await fetch(`${baseUrl}/delete-time/` + id, {
            method: "DELETE"
        })
    },

    //AvailAbility Management

    async postAvailable( dname, chamber, days1, saturdayT, sundayT, mondayT, tuesdayT, wednesdayT, thursdayT, fridayT, serial) {

        // console.log("DAYS!!",selectedCategories);
        // const days1 = selectedCategories.map((item) => item.name);
        const data = {
            dname,
            chamber,
            days1,
            saturdayT,
            sundayT,
            mondayT,
            tuesdayT,
            wednesdayT,
            thursdayT,
            fridayT,
            serial,
        }

        const res = await axios.post(
            `${baseUrl}/post-available`,
            data,
        )
    },

    async editAvailable( dname, chamber, days1, saturdayT, sundayT, mondayT, tuesdayT, wednesdayT, thursdayT, fridayT, serial, _id ) {
        const data = {
            dname,
            chamber,
            days1,
            saturdayT,
            sundayT,
            mondayT,
            tuesdayT,
            wednesdayT,
            thursdayT,
            fridayT,
            serial,
        }
        await axios.post(`${baseUrl}/edit-available/` + _id ,
            data
        )
    },

    async toggleAvailable(is_active, _id) {
        const data = {
            is_active
        }
        await axios.post(`${baseUrl}/toggle-available/` + _id ,
            data
        )
    },

    getAvailable() {
        
        return fetch(`${baseUrl}/get-available`, { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => d.AllData);
    },

    async deleteAvailable(id) {
        await fetch(`${baseUrl}/delete-available/` + id, {
            method: "DELETE"
        })
    },


    //Doctor Management

    async postDoctor( name, specialist, designation, degree, experience) {
        const data = {
            name,
            specialist,
            designation,
            degree,
            experience,
        }

        const res = await axios.post(
            `${baseUrl}/post-doctor`,
            data
        )
    },

    async editDoctor( name, specialist, designation, degree, experience, _id ) {
        const data = {
            name,
            specialist,
            designation,
            degree,
            experience,
        }
        await axios.post(`${baseUrl}/edit-doctor/` + _id ,
            data
        )
    },

    async toggleDoctor(is_active, _id) {
        const data = {
            is_active
        }
        await axios.post(`${baseUrl}/toggle-doctor/` + _id ,
            data
        )
    },

    getDoctor() {
        
        return fetch(`${baseUrl}/get-doctor`, { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => d.AllData);
    },

    async deleteDoctor(id) {
        await fetch(`${baseUrl}/delete-doctor/` + id, {
            method: "DELETE"
        })
    },

    //Specialization

    async postSpecialist(specialist, details) {
        const data = {
            specialist,
            details,
        }
        const res = await axios.post(
            `${baseUrl}/post-specialist`,
            data
        )
    },

    getSpecialist() {
        return fetch(`${baseUrl}/get-specialist`, { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => d.AllData);
    },

    async editSpecialist( specialist, details, _id ) {
        const data = {
            specialist,
            details,
        }
        await axios.post(`${baseUrl}/edit-specialist/` + _id ,
            data
        )
    },

    async toggleSpecialist(is_active, _id) {
        const data = {
            is_active
        }
        await axios.post(`${baseUrl}/toggle-specialist/` + _id ,
            data
        )
    },

    async deleteSpecialist(id) {
        await fetch(`${baseUrl}/delete-specialist/` + id, {
            method: "DELETE"
        })
    },

    //Operator
    
    async getOperator() {
        return fetch(`${baseUrl}/get-operator`, { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => d.AllData);
    },

    
};
