// TypeScript bug https://github.com/microsoft/TypeScript/issues/18877
import { val } from "@plumier/validator"
import "./decorator/val"
export { val }
export {
    AuthorizerFunction, checkAuthorize, Authorizer, CustomAuthorizer, CustomAuthorizerFunction,
    AuthorizationContext, AuthorizerContext, AuthorizeDecorator, updateRouteAuthorizationAccess,
    authPolicy, entityPolicy, EntityPolicyAuthorizerFunction, PolicyAuthorizer, Public, Authenticated,
    AuthPolicy, CustomAuthPolicy, EntityAuthPolicy, EntityProviderQuery, EntityPolicyProviderDecorator,
    globalPolicies, analyzeAuthPolicyNameConflict, PublicAuthPolicy, AuthenticatedAuthPolicy, createMistypeRouteAnalyzer,
    ReadonlyAuthPolicy, WriteonlyAuthPolicy, executeAuthorizer, createAuthContext, throwAuthError, getRouteAuthorizeDecorators
} from "./authorization";
export { HeaderPart, RequestPart, BindingDecorator, binder, ParameterBinderMiddleware, CustomBinderFunction } from "./binder";
export { invoke } from "./application-pipeline";
export { response } from "./response";
export { generateRoutes, findClassRecursive, appendRoute, IgnoreDecorator, RouteDecorator, transformController, ControllerTransformOption } from "./route-generator";
export { analyzeRoutes, printAnalysis } from "./route-analyzer";
export { router } from "./router";
export {
    Class, findFilesRecursive, getChildValue, hasKeyOf, isCustomClass, printTable, toBoolean,
    ellipsis, analyzeModel, AnalysisMessage, entityHelper, globAsync
} from "./common";
export { AuthDecoratorImpl, authorize } from "./decorator/authorize";
export {
    ApiDescriptionDecorator, ApiEnumDecorator, ApiFieldNameDecorator, ApiRequiredDecorator, ApiResponseDecorator,
    ApiTagDecorator, api, ApiReadOnlyDecorator, ApiWriteOnlyDecorator, ApiHideRelationDecorator
} from "./decorator/api"
export { bind } from "./decorator/bind";
export { domain, middleware, entityProvider, responseType, ResponseTypeDecorator } from "./decorator/common";
export { route, RouteDecoratorImpl } from "./decorator/route";
export { EntityIdDecorator, RelationDecorator, entity, DeleteColumnDecorator } from "./decorator/entity";
export { preSave, postSave, RequestHookDecorator } from "./decorator/request-hook";
export { HttpStatus } from "./http-status";
export { validate, ValidatorMiddleware, CustomValidator, ValidatorDecorator, CustomValidatorFunction, AsyncValidatorResult, ValidatorContext, } from "./validator"
export {
    ActionResult, Application, Configuration, DefaultFacility,
    DependencyResolver, Facility, HttpMethod, HttpStatusError, Invocation, KoaMiddleware,
    Middleware, MiddlewareFunction, MiddlewareDecorator, MiddlewareUtil, PlumierApplication, PlumierConfiguration, RedirectActionResult,
    ActionContext, RouteInfo, RouteAnalyzerFunction, RouteAnalyzerIssue,
    ValidationError, errorMessage, DefaultDependencyResolver, CustomConverter,
    CustomMiddleware, CustomMiddlewareFunction, FormFile, HttpCookie, ControllerFactory,
    Metadata, GlobalMetadata, Omit, Optional, RouteMetadata, VirtualRoute,
    GenericController, ControllerGeneric, OneToManyControllerGeneric, Repository, OneToManyRepository,
    FilterQueryType, RelationPropertyDecorator, MetadataImpl, JwtClaims, SelectQuery
} from "./types";