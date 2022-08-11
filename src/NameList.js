import React, { useState } from "react";

const NameList = (props) => {

    const [announcements, setAnnouncements] = useState([]);


    const getDetails = (id) => {
        return fetch(`https://poit.bolagsverket.se/poit/rest/HamtaKungorelse?kungorelseid=${id}`)
            .then((response) => response.json())
            .then((data) => {

                const wholeText = data.kungorelseText;
                let s1 = wholeText.split('Sökandes förslag till efternamn:');

                const namesRaw = s1[1].split('<br>')[0];
                const namesClean = namesRaw.replace(/<\/?[^>]+(>|$)/g, "#");

                const namesArr = namesClean.split('#');
                const names = namesArr.filter(n => n);
                // console.log(names);
                return names;
            });
    }

    const btnUpdateClick = () => {

        fetch('https://poit.bolagsverket.se/poit/rest/SokKungorelse?sokord=&kungorelseid=&kungorelseObjektPersonOrgnummer=&kungorelseObjektNamn=&tidsperiodFrom=2022-08-01&tidsperiodTom=&amnesomradeId=6&kungorelsetypId=48')
            .then((response) => response.json())
            .then((data) => 
            {
                const sortedData = sortByKey(data, 'publiceringsdatum');

                let promises = [];

                sortedData.forEach(x => {
                    promises.push(getDetails(x.kungorelseid));
                });
                let i = 0;
                Promise.all(promises).then(x => {
                    console.log("PROMISE", x);
                    sortedData.forEach(y => {
                        y.names = x[i];
                        i++;
                    })
                    setAnnouncements(sortedData);
                })

                console.log('STATE: ', announcements);
            });

    }

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; 
            var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    return (
    <div>
        <h2>Senaste namnen</h2>
        <button id='btnUpdate' onClick={btnUpdateClick}>Uppdatera</button>
        <div>
            <h6>Resultat:</h6>

            {announcements && announcements.map(x => 
            <div key={x.kungorelseid} className="resultsList">
                <h6>{x.publiceringsdatum} - {x.kungorelseid}</h6>
                <ul>
                    {x.names && x.names.map(y => <li key={y} className={y === 'Apelheed' ? "greenBg" : ""}>{y}</li>)}
                    {/* {x.names.map(y => <li>{y}</li>)} */}
                </ul>

            </div>
            )}

        </div>
    </div>
    )
}

export default NameList;