
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

package com.bytechef.component.jsonfile;

import static com.bytechef.component.jsonfile.constant.JsonFileTaskConstants.FILENAME;
import static com.bytechef.component.jsonfile.constant.JsonFileTaskConstants.FILE_ENTRY;
import static com.bytechef.component.jsonfile.constant.JsonFileTaskConstants.FILE_TYPE;
import static com.bytechef.component.jsonfile.constant.JsonFileTaskConstants.IS_ARRAY;
import static com.bytechef.component.jsonfile.constant.JsonFileTaskConstants.PAGE_NUMBER;
import static com.bytechef.component.jsonfile.constant.JsonFileTaskConstants.PAGE_SIZE;
import static com.bytechef.component.jsonfile.constant.JsonFileTaskConstants.SOURCE;
import static org.skyscreamer.jsonassert.JSONAssert.assertEquals;

import com.bytechef.component.jsonfile.action.JsonFileReadAction;
import com.bytechef.component.jsonfile.action.JsonFileWriteAction;
import com.bytechef.component.jsonfile.constant.JsonFileTaskConstants.FileType;
import com.bytechef.hermes.component.Context;
import com.bytechef.hermes.component.InputParameters;
import com.bytechef.test.jsonasssert.JsonFileAssert;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.assertj.core.api.Assertions;
import org.assertj.core.util.Files;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

/**
 * @author Ivica Cardic
 */
public class JsonFileComponentHandlerTest {

    private static final Context context = Mockito.mock(Context.class);

    @BeforeEach
    public void beforeEach() {
        Mockito.reset(context);
    }

    @Test
    public void testGetComponentDefinition() {
        JsonFileAssert.assertEquals("definition/jsonfile_v1.json", new JsonFileComponentHandler().getDefinition());
    }

    @Test
    @SuppressWarnings("unchecked")
    public void testExecuteReadJSON() throws JSONException, IOException {
        File file = getFile("sample.json");

        Mockito.when(context.readFileToString(Mockito.any(Context.FileEntry.class)))
            .thenReturn(java.nio.file.Files.readString(Path.of(file.getAbsolutePath())));

        InputParameters inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getRequired(FILE_ENTRY, Context.FileEntry.class))
            .thenReturn(Mockito.mock(Context.FileEntry.class));
        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSON");
        Mockito.when(inputParameters.getBoolean(IS_ARRAY))
            .thenReturn(false);

        assertEquals(
            new JSONObject(Files.contentOf(file, StandardCharsets.UTF_8)),
            new JSONObject((Map<String, ?>) JsonFileReadAction.executeRead(context, inputParameters)),
            true);
    }

    @Test
    public void testExecuteReadJSONArray() throws JSONException, FileNotFoundException {
        File file = getFile("sample_array.json");

        Mockito.when(context.getFileStream(Mockito.any(Context.FileEntry.class)))
            .thenReturn(new FileInputStream(file));

        InputParameters inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getRequired(FILE_ENTRY, Context.FileEntry.class))
            .thenReturn(Mockito.mock(Context.FileEntry.class));
        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSON");
        Mockito.when(inputParameters.getBoolean(IS_ARRAY, true))
            .thenReturn(true);
        Mockito.when(inputParameters.getInteger(PAGE_NUMBER))
            .thenReturn(null);
        Mockito.when(inputParameters.getInteger(PAGE_SIZE))
            .thenReturn(null);

        assertEquals(
            new JSONArray(Files.contentOf(file, StandardCharsets.UTF_8)),
            new JSONArray((List<?>) JsonFileReadAction.executeRead(context, inputParameters)),
            true);

        Mockito.when(context.getFileStream(Mockito.any(Context.FileEntry.class)))
            .thenReturn(new FileInputStream(file));

        inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getRequired(FILE_ENTRY, Context.FileEntry.class))
            .thenReturn(Mockito.mock(Context.FileEntry.class));
        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSON");
        Mockito.when(inputParameters.getBoolean(IS_ARRAY, true))
            .thenReturn(true);
        Mockito.when(inputParameters.getInteger(PAGE_NUMBER))
            .thenReturn(1);
        Mockito.when(inputParameters.getInteger(PAGE_SIZE))
            .thenReturn(2);

        Assertions.assertThat(((List<?>) JsonFileReadAction.executeRead(context, inputParameters)).size())
            .isEqualTo(2);
    }

    @Test
    public void testExecuteReadJSONL() throws JSONException, IOException {
        File file = getFile("sample.jsonl");

        Mockito.when(context.getFileStream(Mockito.any(Context.FileEntry.class)))
            .thenReturn(new FileInputStream(file));

        InputParameters inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getRequired(FILE_ENTRY, Context.FileEntry.class))
            .thenReturn(Mockito.mock(Context.FileEntry.class));
        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSONL");
        Mockito.when(inputParameters.getBoolean(IS_ARRAY, true))
            .thenReturn(true);
        Mockito.when(inputParameters.getInteger(PAGE_NUMBER))
            .thenReturn(null);
        Mockito.when(inputParameters.getInteger(PAGE_SIZE))
            .thenReturn(null);

        assertEquals(
            new JSONArray(Files.contentOf(getFile("sample_array.json"), StandardCharsets.UTF_8)),
            new JSONArray((List<?>) JsonFileReadAction.executeRead(context, inputParameters)),
            true);

        Mockito.when(context.getFileStream(Mockito.any(Context.FileEntry.class)))
            .thenReturn(new FileInputStream(file));

        inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getRequired(FILE_ENTRY, Context.FileEntry.class))
            .thenReturn(Mockito.mock(Context.FileEntry.class));
        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSONL");
        Mockito.when(inputParameters.getBoolean(IS_ARRAY, true))
            .thenReturn(true);
        Mockito.when(inputParameters.getInteger(PAGE_NUMBER))
            .thenReturn(1);
        Mockito.when(inputParameters.getInteger(PAGE_SIZE))
            .thenReturn(2);

        Assertions.assertThat(((List<?>) JsonFileReadAction.executeRead(context, inputParameters)).size())
            .isEqualTo(2);
    }

    @Test
    public void testExecuteWriteJSON() throws JSONException {
        File file = getFile("sample.json");

        InputParameters inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSON");
        Mockito.when(inputParameters.getRequired(SOURCE))
            .thenReturn(new JSONObject(Files.contentOf(file, StandardCharsets.UTF_8)).toMap());

        JsonFileWriteAction.executeWrite(context, inputParameters);

        ArgumentCaptor<ByteArrayInputStream> inputStreamArgumentCaptor = ArgumentCaptor
            .forClass(ByteArrayInputStream.class);
        ArgumentCaptor<String> filenameArgumentCaptor = ArgumentCaptor.forClass(String.class);

        Mockito.verify(context)
            .storeFileContent(filenameArgumentCaptor.capture(), inputStreamArgumentCaptor.capture());

        assertEquals(
            new JSONObject(new String(inputStreamArgumentCaptor.getValue()
                .readAllBytes(), StandardCharsets.UTF_8)),
            new JSONObject(Files.contentOf(file, StandardCharsets.UTF_8)),
            true);
        Assertions.assertThat(filenameArgumentCaptor.getValue())
            .isEqualTo("file.json");
    }

    @Test
    public void testExecuteWriteJSONArray() throws JSONException {
        File file = getFile("sample_array.json");

        InputParameters inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSON");
        Mockito.when(inputParameters.getRequired(SOURCE))
            .thenReturn(new JSONArray(Files.contentOf(file, StandardCharsets.UTF_8)).toList());

        JsonFileWriteAction.executeWrite(context, inputParameters);

        ArgumentCaptor<ByteArrayInputStream> inputStreamArgumentCaptor = ArgumentCaptor
            .forClass(ByteArrayInputStream.class);
        ArgumentCaptor<String> filenameArgumentCaptor = ArgumentCaptor.forClass(String.class);

        Mockito.verify(context)
            .storeFileContent(filenameArgumentCaptor.capture(), inputStreamArgumentCaptor.capture());

        assertEquals(
            new JSONArray(new String(inputStreamArgumentCaptor.getValue()
                .readAllBytes(), StandardCharsets.UTF_8)),
            new JSONArray(Files.contentOf(file, StandardCharsets.UTF_8)),
            true);
        Assertions.assertThat(filenameArgumentCaptor.getValue())
            .isEqualTo("file.json");

        Mockito.reset(context);

        inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getString(FILENAME))
            .thenReturn("test.json");
        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSONL");
        Mockito.when(inputParameters.getRequired(SOURCE))
            .thenReturn(new JSONArray(Files.contentOf(file, StandardCharsets.UTF_8)).toList());

        JsonFileWriteAction.executeWrite(context, inputParameters);

        filenameArgumentCaptor = ArgumentCaptor.forClass(String.class);

        Mockito.verify(context)
            .storeFileContent(filenameArgumentCaptor.capture(), Mockito.any(InputStream.class));

        Assertions.assertThat(filenameArgumentCaptor.getValue())
            .isEqualTo("test.json");
    }

    @Test
    public void testExecuteWriteJSONL() throws JSONException {
        File file = getFile("sample.jsonl");
        InputParameters inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSONL");
        Mockito.when(inputParameters.getRequired(SOURCE))
            .thenReturn(
                linesOf(Files.contentOf(file, StandardCharsets.UTF_8)).toList());

        JsonFileWriteAction.executeWrite(context, inputParameters);

        ArgumentCaptor<ByteArrayInputStream> inputStreamArgumentCaptor = ArgumentCaptor
            .forClass(ByteArrayInputStream.class);
        ArgumentCaptor<String> filenameArgumentCaptor = ArgumentCaptor.forClass(String.class);

        Mockito.verify(context)
            .storeFileContent(filenameArgumentCaptor.capture(), inputStreamArgumentCaptor.capture());

        assertEquals(
            linesOf(new String(inputStreamArgumentCaptor.getValue()
                .readAllBytes(), StandardCharsets.UTF_8)),
            linesOf(Files.contentOf(file, StandardCharsets.UTF_8)),
            true);
        Assertions.assertThat(filenameArgumentCaptor.getValue())
            .isEqualTo("file.jsonl");

        Mockito.reset(context);

        inputParameters = Mockito.mock(InputParameters.class);

        Mockito.when(inputParameters.getString(FILENAME))
            .thenReturn("test.jsonl");
        Mockito.when(inputParameters.getString(FILE_TYPE, FileType.JSON.name()))
            .thenReturn("JSONL");
        Mockito.when(inputParameters.getRequired(SOURCE))
            .thenReturn(
                linesOf(Files.contentOf(file, StandardCharsets.UTF_8)).toList());

        JsonFileWriteAction.executeWrite(context, inputParameters);

        Mockito.verify(context)
            .storeFileContent(filenameArgumentCaptor.capture(), Mockito.any(InputStream.class));

        Assertions.assertThat(filenameArgumentCaptor.getValue())
            .isEqualTo("test.jsonl");
    }

    private File getFile(String filename) {
        return new File(JsonFileComponentHandlerTest.class
            .getClassLoader()
            .getResource("dependencies/" + filename)
            .getFile());
    }

    private static JSONArray linesOf(String jsonl) {
        return new JSONArray("[" + jsonl.replace("\n", ",") + "]");
    }
}
