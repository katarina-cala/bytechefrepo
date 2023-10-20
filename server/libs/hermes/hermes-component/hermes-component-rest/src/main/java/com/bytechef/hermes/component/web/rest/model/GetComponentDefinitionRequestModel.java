
/*
 * Copyright 2021 <your company/name>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.bytechef.hermes.component.web.rest.model;

import com.bytechef.hermes.component.definition.ConnectionDefinition;
import com.bytechef.hermes.definition.Display;
import com.bytechef.hermes.definition.Resources;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;

@Schema(
    name = "GetComponentDefinitionRequestModel",
    description = "A component contains a set of reusable code(actions) that accomplish specific tasks, triggers(TODO) and connections if there is a need for a connection to an outside service.")
@SuppressFBWarnings({
    "EI", "EI2"
})
public record GetComponentDefinitionRequestModel(
    @Schema(
        name = "actions",
        description = "The list of all available actions the component can perform.") List<GetComponentDefinitionActionDefinitionRequestModel> actions,
    ConnectionDefinition connection,
    Display display,
    @Schema(
        name = "metadata",
        description = "Additional data that can be used during processing.") Map<String, Object> metadata,
    @Schema(name = "name", description = "The component name.") String name,
    Resources resources,
    @Schema(name = "version", description = "The component version.") int version) {
}
