/* tslint:disable */
/* eslint-disable */
/**
 * The Embedded Configuration API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface IntegrationInstanceIntegrationModel
 */
export interface IntegrationInstanceIntegrationModel {
    /**
     * The created by.
     * @type {string}
     * @memberof IntegrationInstanceIntegrationModel
     */
    readonly createdBy?: string;
    /**
     * The created date.
     * @type {Date}
     * @memberof IntegrationInstanceIntegrationModel
     */
    readonly createdDate?: Date;
    /**
     * The description of a integration.
     * @type {string}
     * @memberof IntegrationInstanceIntegrationModel
     */
    description?: string;
    /**
     * The id of a integration.
     * @type {number}
     * @memberof IntegrationInstanceIntegrationModel
     */
    readonly id?: number;
    /**
     * The last modified by.
     * @type {string}
     * @memberof IntegrationInstanceIntegrationModel
     */
    readonly lastModifiedBy?: string;
    /**
     * The last modified date.
     * @type {Date}
     * @memberof IntegrationInstanceIntegrationModel
     */
    readonly lastModifiedDate?: Date;
    /**
     * The name of a integration.
     * @type {string}
     * @memberof IntegrationInstanceIntegrationModel
     */
    name: string;
    /**
     * The published date.
     * @type {Date}
     * @memberof IntegrationInstanceIntegrationModel
     */
    publishedDate?: Date;
    /**
     * The version of a integration.
     * @type {number}
     * @memberof IntegrationInstanceIntegrationModel
     */
    integrationVersion?: number;
    /**
     * The status of a integration.
     * @type {string}
     * @memberof IntegrationInstanceIntegrationModel
     */
    status?: IntegrationInstanceIntegrationModelStatusEnum;
}


/**
 * @export
 */
export const IntegrationInstanceIntegrationModelStatusEnum = {
    Published: 'PUBLISHED',
    Unpublished: 'UNPUBLISHED'
} as const;
export type IntegrationInstanceIntegrationModelStatusEnum = typeof IntegrationInstanceIntegrationModelStatusEnum[keyof typeof IntegrationInstanceIntegrationModelStatusEnum];


/**
 * Check if a given object implements the IntegrationInstanceIntegrationModel interface.
 */
export function instanceOfIntegrationInstanceIntegrationModel(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function IntegrationInstanceIntegrationModelFromJSON(json: any): IntegrationInstanceIntegrationModel {
    return IntegrationInstanceIntegrationModelFromJSONTyped(json, false);
}

export function IntegrationInstanceIntegrationModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): IntegrationInstanceIntegrationModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdBy': !exists(json, 'createdBy') ? undefined : json['createdBy'],
        'createdDate': !exists(json, 'createdDate') ? undefined : (new Date(json['createdDate'])),
        'description': !exists(json, 'description') ? undefined : json['description'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'lastModifiedBy': !exists(json, 'lastModifiedBy') ? undefined : json['lastModifiedBy'],
        'lastModifiedDate': !exists(json, 'lastModifiedDate') ? undefined : (new Date(json['lastModifiedDate'])),
        'name': json['name'],
        'publishedDate': !exists(json, 'publishedDate') ? undefined : (new Date(json['publishedDate'])),
        'integrationVersion': !exists(json, 'integrationVersion') ? undefined : json['integrationVersion'],
        'status': !exists(json, 'status') ? undefined : json['status'],
    };
}

export function IntegrationInstanceIntegrationModelToJSON(value?: IntegrationInstanceIntegrationModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'description': value.description,
        'name': value.name,
        'publishedDate': value.publishedDate === undefined ? undefined : (value.publishedDate.toISOString()),
        'integrationVersion': value.integrationVersion,
        'status': value.status,
    };
}

