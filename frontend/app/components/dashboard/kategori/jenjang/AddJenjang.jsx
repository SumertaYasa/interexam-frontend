import { Link } from "react-router";
import { useState, useEffect } from "react";


import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import ButtonAdd from "../../common/ButtonAdd";
import DynamicTable from "../../common/DynamicTable";

const dummyJenjang = [
    { id: 1, jenjang: "SD", deskripsi: "Mempelajari konsep dasar PLSV dan penyelesaiannya." },
    { id: 2, jenjang: "SMP", deskripsi: "Detail organel sel hewan dan fungsinya." },
    { id: 3, jenjang: "SMA", deskripsi: "Konsep kelembaman benda." },
    
];

export default function JenjangTable() {
    return (
        <div>
            <h1>Add Jenjang</h1>
        </div>
    );
}