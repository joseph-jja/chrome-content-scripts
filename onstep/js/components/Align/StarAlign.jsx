import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import CustomSelect from 'js/components/base/CustomSelect.jsx';
import CustomOption from 'js/components/base/CustomOption.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand,
    getStarList,
    getKnownStarList
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';
import StorageBox from "js/storage/StorageBox.js";
import {
    ASTRONOMY_API
} from 'js/storage/StorageBox.js';
import {
    safeParse
} from 'js/utils/jsonUtils.js';

const {
    useState,
    useEffect
} = React;

const STAR_ALIGN = [];
const coords = [];
for (let i = 1; i <= 9; i++) {
    STAR_ALIGN.push(`:A${i}#`);
}

export default function ToggleTracking() {
    const [alignmentError, setAlignmentError] = useState(null);
    const [rightAscention, setRightAscention] = useState('');
    const [declination, setDeclination] = useState('');
    const [knownStarList, setKnownStarList] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {

        const fetchData = async () => {
            const latitude = StorageBox.getItem('latitude') || window?.electron?.config?.latitude;
            const longitude = StorageBox.getItem('longitude') || window?.electron?.config?.longitude;
            if (!latitude || !longitude) {
                setErrorMsg('Missing latitude or longitude');
                return;
            }
            const [err, results] = await PromiseWrapper(getKnownStarList(latitude, longitude));
            if (results) {
                setKnownStarList(safeParse(results)?.sort((a, b) => {
                    return (a.name.localeCompare(b.name));
                }));
                return;
            }
            setErrorMsg(err);
        };
        fetchData();
    }, []);

    const displayStarRADec = (event) => {
        const targetObj = event?.target;
        if (!targetObj) {
            return;
        }
        const star = targetObj.options[targetObj.selectedIndex].value.trim();
        if (star && star.length > 0) {
            const starCoors = knownStarList.find(item => item.name === star);
            
        }
    };

    const searchLocation = (event) => {
        const authCode = btoa(`${electron?.config?.ApplicationID}:${electron?.config?.SecretID}`);
        if (!altitude || !azimuth) {
            setAlignmentError('Missing altitude or azimuth!');
            return;
        }
        const latitude = StorageBox.getItem('latitude') || window?.electron?.config?.latitude;
        const longitude = StorageBox.getItem('longitude') || window?.electron?.config?.longitude;
        if (!latitude || !longitude) {
            setAlignmentError('Missing latitude or longitude!');
            return;
        }
        const now = new Date();
        const {
            ra,
            dec
        } = window.altAzToRaDec(altitude, azimuth, latitude, longitude, now);
        setRightAscention('RA: ' + ra);
        setDeclination('DEC: ' + dec);
        getStarList(authCode, ra, dec).then(results => {
            const jsonResults = safeParse(results)?.data;
            if (jsonResults) {
                const starList = jsonResults.filter(item => {
                    return (item?.type?.name?.toLowerCase() === 'star');
                }).filter(item => {
                    return (item?.position?.equatorial?.declination?.string &&
                        item?.position?.equatorial?.rightAscension?.string);
                }).map(item => {
                    const cname = item?.position?.constellation?.name;
                    const rahh = item?.position?.equatorial?.rightAscension?.string;
                    const dechh = item?.position?.equatorial?.declination?.string;
                    return `${item.name}: (Constellation: ${cname}) RA/Dec: ${rahh}/${dechh}`;
                });
                //StorageBox.setItem(`${+ra + +dec}`, starList);
                setAlignmentError(starList);
                console.log(starList);
            } else {
                setAlignmentError('Could not parse json response');
            }
        }).catch(e => {
            setAlignmentError(e);
        })
    };

    const setAlignNumberValue = async (event) => {
        const targetObj = event?.target;
        if (!targetObj) {
            return;
        }
        const cmd = targetObj.options[targetObj.selectedIndex].value.trim();
        if (cmd && cmd.length > 0) {
            const [err, results] = await PromiseWrapper(sendCommand({
                command: cmd
            }));
            if (err || results !== 0) {
                setAlignmentError(err || results);
            } else {
                setAlignmentError('');
            }
        }
    };

    // 	:AW# - save align
    // 	:Ax# - align x stars
    //  :A+# - accept
    return (
        <Container class="wrapper">

            <CustomSelect id="pick-numberof-stars" name="pick_numberof_stars"
                labelText="Select Number of Stars"
                onSelectChange={setAlignNumberValue}>
                <CustomOption></CustomOption>
                {STAR_ALIGN?.map((item) => (
                    <CustomOption value={item}>
                        Rate {item}
                    </CustomOption>
                ))}
            </CustomSelect>

            <br/>
            <CustomSelect id="pick-star" name="pick_star"
                labelText="Select A Star"
                onSelectChange={displayStarRADec}>
                <CustomOption></CustomOption>
                {knownStarList?.map((item) => (
                    <CustomOption value={item.name}>
                         {item.name} (Mag: {item.mag}, RA: {item.ra}, Dec: {item.dec})
                    </CustomOption>
                ))}
            </CustomSelect>
            
            <br/>View Star: 
              <span>RA: {rightAscention}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{declination}</span> 
              <br/> 
              <CustomButton id="search-coordinates" onButtonClick={searchLocation}>Get View</CustomButton>
            <ErrorMessage>{alignmentError}</ErrorMessage>                
        </Container>
    );
}
