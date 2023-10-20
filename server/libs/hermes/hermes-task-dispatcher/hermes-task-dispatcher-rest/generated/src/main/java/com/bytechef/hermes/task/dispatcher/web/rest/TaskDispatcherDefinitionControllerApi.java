/**
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech) (6.2.0).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
package com.bytechef.hermes.task.dispatcher.web.rest;

import com.bytechef.hermes.task.dispatcher.web.rest.model.TaskDispatcherDefinitionModel;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.http.codec.multipart.Part;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.annotation.Generated;

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2022-10-27T16:28:51.543539+02:00[Europe/Zagreb]")
@Validated
@Tag(name = "TaskDispatcherDefinitionController", description = "the TaskDispatcherDefinitionController API")
@RequestMapping("${openapi.openAPIDefinition.base-path:}")
public interface TaskDispatcherDefinitionControllerApi {

    /**
     * GET /definitions/task-dispatchers
     *
     * @return OK (status code 200)
     */
    @Operation(
        operationId = "getTaskDispatcherDefinitions",
        tags = { "TaskDispatcherDefinitionController" },
        responses = {
            @ApiResponse(responseCode = "200", description = "OK", content = {
                @Content(mediaType = "application/json", schema = @Schema(implementation = TaskDispatcherDefinitionModel.class))
            })
        }
    )
    @RequestMapping(
        method = RequestMethod.GET,
        value = "/definitions/task-dispatchers",
        produces = { "application/json" }
    )
    default Mono<ResponseEntity<Flux<TaskDispatcherDefinitionModel>>> getTaskDispatcherDefinitions(
        @Parameter(hidden = true) final ServerWebExchange exchange
    ) {
        Mono<Void> result = Mono.empty();
        exchange.getResponse().setStatusCode(HttpStatus.NOT_IMPLEMENTED);
        for (MediaType mediaType : exchange.getRequest().getHeaders().getAccept()) {
            if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                String exampleString = "{ \"inputs\" : [ null, null ], \"display\" : { \"icon\" : \"icon\", \"description\" : \"description\", \"label\" : \"label\" }, \"name\" : \"name\", \"resources\" : { \"documentationUrl\" : \"documentationUrl\" }, \"version\" : 0 }";
                result = ApiUtil.getExampleResponse(exchange, mediaType, exampleString);
                break;
            }
        }
        return result.then(Mono.empty());

    }

}
