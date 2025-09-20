const populationURL = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";
const employmentURL = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";

const fetchStatFinData = async(url, body)=> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return await response.json();
};

const initializeCode = async ()=> {
    const populationBody = await (await fetch("/data/population_query.json")).json();
    const employmentBody = await (await fetch("/data/employment_query.json")).json();

    const [populationData, employmentData] = await Promise.all([
        fetchStatFinData(populationURL, populationBody),
        fetchStatFinData(employmentURL, employmentBody)
    ]);

    const setupTable = (populationData, employmentData) => {
        const tbody = document.getElementById("tRows");
        const popLabels = populationData.dimension.Alue.category.label;
        const popValues = populationData.value;
        const empValues = employmentData.value;


        Object.entries(popLabels).forEach(([code, name], index) => {
            const tr = document.createElement("tr");

            const tdName = document.createElement("td");
            tdName.textContent = name;
            tr.appendChild(tdName);


            const tdPop = document.createElement("td");
            tdPop.textContent = populationData.value[index];
            tr.appendChild(tdPop);

            const tdEmp = document.createElement("td");
            tdEmp.textContent = empValues[index]; 
            tr.appendChild(tdEmp);
            const rateNumber =  (empValues[index] / popValues[index]) * 100;
            const tdRate = document.createElement("td");
            tdRate.textContent = rateNumber.toFixed(2)+"%";
            tr.appendChild(tdRate);
            if (rateNumber >= 45){
                tr.classList.add("over45rate");
                
            }
            else if (rateNumber < 25){
                tr.classList.add("under25rate");
            }

            tbody.appendChild(tr);
        });
    };

    setupTable(populationData, employmentData);
};

initializeCode();
