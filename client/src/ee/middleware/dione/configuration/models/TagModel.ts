/* tslint:disable */
/* eslint-disable */
/**
 * Integration Configuration API
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
 * A tag.
 * @export
 * @interface TagModel
 */
export interface TagModel {
    /**
     * The created by.
     * @type {string}
     * @memberof TagModel
     */
    readonly createdBy?: string;
    /**
     * The created date.
     * @type {Date}
     * @memberof TagModel
     */
    readonly createdDate?: Date;
    /**
     * The id of the tag.
     * @type {number}
     * @memberof TagModel
     */
    id?: number;
    /**
     * The last modified by.
     * @type {string}
     * @memberof TagModel
     */
    readonly lastModifiedBy?: string;
    /**
     * The last modified date.
     * @type {Date}
     * @memberof TagModel
     */
    readonly lastModifiedDate?: Date;
    /**
     * The name of the tag.
     * @type {string}
     * @memberof TagModel
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof TagModel
     */
    version?: number;
}

/**
 * Check if a given object implements the TagModel interface.
 */
export function instanceOfTagModel(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function TagModelFromJSON(json: any): TagModel {
    return TagModelFromJSONTyped(json, false);
}

export function TagModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): TagModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdBy': !exists(json, 'createdBy') ? undefined : json['createdBy'],
        'createdDate': !exists(json, 'createdDate') ? undefined : (new Date(json['createdDate'])),
        'id': !exists(json, 'id') ? undefined : json['id'],
        'lastModifiedBy': !exists(json, 'lastModifiedBy') ? undefined : json['lastModifiedBy'],
        'lastModifiedDate': !exists(json, 'lastModifiedDate') ? undefined : (new Date(json['lastModifiedDate'])),
        'name': json['name'],
        'version': !exists(json, '__version') ? undefined : json['__version'],
    };
}

export function TagModelToJSON(value?: TagModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        '__version': value.version,
    };
}

