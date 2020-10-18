import React from 'react'
import {Card, CardContent, Typography} from "@material-ui/core"
import "./InfoBox.css"

function InfoBox({title, cases, active, isRed,isBlue, total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red"}  ${isBlue && "infoBox--blue"}`}>
            <CardContent>
                <Typography color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infobox_cases ${isRed && "infobox_cases--red"} ${isBlue && "infobox_cases--blue"} `}>{cases}</h2>
                <Typography className="infobox_total" color="textSecondary">
                    {total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox
