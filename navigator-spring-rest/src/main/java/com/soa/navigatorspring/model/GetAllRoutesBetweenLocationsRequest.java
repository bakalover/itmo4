//
// This file was generated by the Eclipse Implementation of JAXB, v3.0.0 
// See https://eclipse-ee4j.github.io/jaxb-ri 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2024.12.13 at 11:09:11 PM MSK 
//


package com.soa.navigatorspring.model;

import jakarta.xml.bind.annotation.*;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="idFrom" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="idTo" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="orderBy" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "idFrom",
    "idTo",
    "orderBy"
})
@XmlRootElement(name = "getAllRoutesBetweenLocationsRequest")
public class GetAllRoutesBetweenLocationsRequest {

    protected long idFrom;
    protected long idTo;
    @XmlElement(required = true)
    protected String orderBy;

    /**
     * Gets the value of the idFrom property.
     * 
     */
    public long getIdFrom() {
        return idFrom;
    }

    /**
     * Sets the value of the idFrom property.
     * 
     */
    public void setIdFrom(long value) {
        this.idFrom = value;
    }

    /**
     * Gets the value of the idTo property.
     * 
     */
    public long getIdTo() {
        return idTo;
    }

    /**
     * Sets the value of the idTo property.
     * 
     */
    public void setIdTo(long value) {
        this.idTo = value;
    }

    /**
     * Gets the value of the orderBy property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOrderBy() {
        return orderBy;
    }

    /**
     * Sets the value of the orderBy property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOrderBy(String value) {
        this.orderBy = value;
    }

}
