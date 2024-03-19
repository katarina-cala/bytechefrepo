/* tslint:disable */
/* eslint-disable */
/**
 * The Automation Configuration API
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
import type { ProjectStatusModel } from './ProjectStatusModel';
import {
    ProjectStatusModelFromJSON,
    ProjectStatusModelFromJSONTyped,
    ProjectStatusModelToJSON,
} from './ProjectStatusModel';

/**
 * A group of workflows that make one logical project.
 * @export
 * @interface ProjectBasicModel
 */
export interface ProjectBasicModel {
    /**
     * The created by.
     * @type {string}
     * @memberof ProjectBasicModel
     */
    readonly createdBy?: string;
    /**
     * The created date.
     * @type {Date}
     * @memberof ProjectBasicModel
     */
    readonly createdDate?: Date;
    /**
     * The description of a project.
     * @type {string}
     * @memberof ProjectBasicModel
     */
    description?: string;
    /**
     * The id of a project.
     * @type {number}
     * @memberof ProjectBasicModel
     */
    readonly id?: number;
    /**
     * The last modified by.
     * @type {string}
     * @memberof ProjectBasicModel
     */
    readonly lastModifiedBy?: string;
    /**
     * The last modified date.
     * @type {Date}
     * @memberof ProjectBasicModel
     */
    readonly lastModifiedDate?: Date;
    /**
     * The name of a project.
     * @type {string}
     * @memberof ProjectBasicModel
     */
    name: string;
    /**
     * The published date.
     * @type {Date}
     * @memberof ProjectBasicModel
     */
    publishedDate?: Date;
    /**
     * The version of a project.
     * @type {number}
     * @memberof ProjectBasicModel
     */
    projectVersion?: number;
    /**
     * 
     * @type {ProjectStatusModel}
     * @memberof ProjectBasicModel
     */
    status?: ProjectStatusModel;
}

/**
 * Check if a given object implements the ProjectBasicModel interface.
 */
export function instanceOfProjectBasicModel(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function ProjectBasicModelFromJSON(json: any): ProjectBasicModel {
    return ProjectBasicModelFromJSONTyped(json, false);
}

export function ProjectBasicModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectBasicModel {
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
        'projectVersion': !exists(json, 'projectVersion') ? undefined : json['projectVersion'],
        'status': !exists(json, 'status') ? undefined : ProjectStatusModelFromJSON(json['status']),
    };
}

export function ProjectBasicModelToJSON(value?: ProjectBasicModel | null): any {
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
        'projectVersion': value.projectVersion,
        'status': ProjectStatusModelToJSON(value.status),
    };
}

