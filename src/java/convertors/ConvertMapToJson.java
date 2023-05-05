/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package convertors;

import entity.Author;
import entity.Book;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

/**
 *
 * @author pupil
 */
public class ConvertMapToJson {
    public JsonArray getJsonObjectMap(Map<Author, List<Book>> mapAuthors){
        JsonArrayBuilder jsonMapBuilder = Json.createArrayBuilder();
        JsonObjectBuilder jsonEntryObjectBuilder = Json.createObjectBuilder();
        for(Entry entry: mapAuthors.entrySet()){
            Author author = (Author) entry.getKey();
            JsonObject JsonObjectAuthor = getJsonObjectAuthor(author);
            List<Book> authorBooks = (List<Book>) entry.getValue();
            JsonArray jsonArrayBooks = getJsonArrayBooks(authorBooks);
            jsonEntryObjectBuilder.add(JsonObjectAuthor.toString(),jsonArrayBooks);
            jsonMapBuilder.add(jsonEntryObjectBuilder.build());
        }
        return jsonMapBuilder.build(); 
    }
    
    public JsonObject getJsonObjectAuthor(Author author){
        JsonObjectBuilder job = Json.createObjectBuilder();
        job.add("id", author.getId());
        job.add("firstname", author.getFirstname());
        job.add("lastname", author.getLastname());
        return job.build();
    }
    public JsonObject getJsonObjectBook(Book book){
        JsonObjectBuilder job = Json.createObjectBuilder();
        JsonArrayBuilder jab = Json.createArrayBuilder();
        job.add("id", book.getId());
        job.add("bookName", book.getBookName());
        job.add("publishedYear", book.getPublishedYear());
        job.add("quantity", book.getQuantity());
        job.add("authors", getJsonArrayAuthors(book.getAuthors()));
        return job.build();
    }
    public JsonArray getJsonArrayAuthors(List<Author>listAuthors){
        JsonArrayBuilder jar = Json.createArrayBuilder();
        for (int i = 0; i < listAuthors.size(); i++) {
            Author author = listAuthors.get(i);
            jar.add(getJsonObjectAuthor(author));
        }
        return jar.build();
    }
    public JsonArray getJsonArrayBooks(List<Book>listBooks){
        JsonArrayBuilder jar = Json.createArrayBuilder();
        for (int i = 0; i < listBooks.size(); i++) {
            Book book = listBooks.get(i);
            jar.add(getJsonObjectBook(book));
        }
        return jar.build();
    }
}