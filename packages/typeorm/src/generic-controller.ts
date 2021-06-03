import { authorize, Class, entity, GenericControllers, Repository } from "@plumier/core"
import {
    createGenericController,
    EntityWithRelation,
    GenericControllerConfiguration,
    NestedRepositoryFactory,
    RepoBaseControllerGeneric,
    RepoBaseNestedControllerGeneric,
} from "@plumier/generic-controller"
import reflect, { generic, noop, useCache } from "@plumier/reflect"
import { parse } from "acorn"
import pluralize from "pluralize"
import { getMetadataArgsStorage } from "typeorm"

import { TypeORMNestedRepository, TypeORMRepository } from "./repository"

// --------------------------------------------------------------------- //
// ------------------------------- HELPER ------------------------------ //
// --------------------------------------------------------------------- //


function normalizeEntityNoCache(type: Class) {
    const parent: Class = Object.getPrototypeOf(type)
    // loop through parent entities 
    if (!!parent.prototype) normalizeEntity(parent)
    const storage = getMetadataArgsStorage();
    const columns = storage.filterColumns(type)
    for (const col of columns) {
        Reflect.decorate([noop()], (col.target as Function).prototype, col.propertyName, void 0)
        if (col.options.primary)
            Reflect.decorate([entity.primaryId(), authorize.readonly()], (col.target as Function).prototype, col.propertyName, void 0)
    }
    const relations = storage.filterRelations(type)
    for (const col of relations) {
        const rawType: Class = (col as any).type()
        if (col.relationType === "many-to-many" || col.relationType === "one-to-many") {
            const inverseProperty = inverseSideParser(col.inverseSideProperty as any)
            const decorators = [
                reflect.type(x => [rawType]),
                entity.relation({ inverseProperty }),
                authorize.readonly(),
                authorize.writeonly()
            ]
            Reflect.decorate(decorators, (col.target as Function).prototype, col.propertyName, void 0)
        }
        else {
            Reflect.decorate([reflect.type(x => rawType), entity.relation()], (col.target as Function).prototype, col.propertyName, void 0)
        }
    }
}

const normalizeEntityCache = new Map<Class, any>()

const normalizeEntity = useCache(normalizeEntityCache, normalizeEntityNoCache, x => x)

// --------------------------------------------------------------------- //
// ---------------------- INVERSE PROPERTY PARSER ---------------------- //
// --------------------------------------------------------------------- //

function inverseSideParser(expr: ((t: any) => any)) {
    const node = parse(expr.toString(), { ecmaVersion: 2020 })
    return getMemberExpression(node)
}

function getContent(node: any): any {
    switch (node.type) {
        case "Program":
        case "BlockStatement":
            return node.body[node.body.length - 1]
        case "ArrowFunctionExpression":
            return node.body
        case "ExpressionStatement":
            return node.expression
        case "ReturnStatement":
            return node.argument
    }
}

function getMemberExpression(node: any): string {
    const content = getContent(node)
    if (content.type === "MemberExpression")
        return content.property.name
    else
        return getMemberExpression(content)
}

// --------------------------------------------------------------------- //
// ------------------------ GENERIC CONTROLLERS ------------------------ //
// --------------------------------------------------------------------- //

@generic.parameter("T", "TID")
@generic.argument("T", "TID")
class TypeORMControllerGeneric<T = any, TID = any> extends RepoBaseControllerGeneric<T, TID>{
    constructor(fac?: ((x: Class<T>) => Repository<T>)) {
        super(fac ?? (x => new TypeORMRepository(x)))
    }
}

@generic.parameter("P", "T", "PID", "TID")
@generic.argument("P", "T", "PID", "TID")
class TypeORMNestedControllerGeneric<P = any, T = any, PID = any, TID = any> extends RepoBaseNestedControllerGeneric<P, T, PID, TID> {
    constructor(fac?: NestedRepositoryFactory<P, T>) {
        super(fac ?? (p => new TypeORMNestedRepository(p)))
    }
}

/**
 * Generic controller factory factory, used to create a generic controller factory with custom generic controller implementation
 * @param controllers Custom generic controller implementation
 * @returns generic controller
 */
function createGenericControllerTypeORM(controllers?: GenericControllers) {
    return <T>(type: Class | EntityWithRelation<T>, config?: GenericControllerConfiguration) =>
        createGenericController(type, {
            controllers: controllers ?? [TypeORMControllerGeneric, TypeORMNestedControllerGeneric],
            nameConversion: pluralize,
            config, normalize: type => {
                if (Array.isArray(type)) {
                    const [parentEntity, relation] = type
                    normalizeEntity(parentEntity)
                    const meta = reflect(parentEntity)
                    const prop = meta.properties.find(x => x.name === relation)!
                    const entity: Class = Array.isArray(prop.type) ? prop.type[0] : prop.type
                    normalizeEntity(entity)
                }
                else
                    normalizeEntity(type)
            }
        })
}

/**
 * Create a generic controller with CRUD functionality based on Entity
 * @param type entity used as the generic controller parameter
 * @param config configuration to authorize/enable/disable some actions
 */
function GenericController<T>(type: Class, config?: GenericControllerConfiguration): Class<TypeORMControllerGeneric<T>>
/**
 * Create a nested generic controller with CRUD functionality based on Entity's One-To-Many on Many-To-One relation property
 * @param relation Tuple of [Entity, relationName] used to specify entity relation as a reference of the nested generic controller
 * @param config configuration to authorize/enable/disable some actions
 */
function GenericController<T>(relation: EntityWithRelation<T>, config?: GenericControllerConfiguration): Class<TypeORMNestedControllerGeneric<T>>
function GenericController<T>(type: Class | EntityWithRelation<T>, config?: GenericControllerConfiguration) {
    const factory = createGenericControllerTypeORM()
    return factory(type, config)
}

export { TypeORMControllerGeneric, TypeORMNestedControllerGeneric, normalizeEntity, GenericController, createGenericControllerTypeORM, EntityWithRelation }