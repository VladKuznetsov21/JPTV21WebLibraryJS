/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

/**
 *
 * @author pupil
 */
@Entity
public class Book implements Serializable{
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bookName;
    private String publishedYear;
    private String quantity;
    @OneToMany
    private List<Author> authors;
    @OneToOne
    private Cover cover;

    public Book() {
        authors = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(String publishedYear) {
        this.publishedYear = publishedYear;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public List<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(List<Author> authors) {
        this.authors = authors;
    }

    public Cover getCover() {
        return cover;
    }

    public void setCover(Cover cover) {
        this.cover = cover;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 41 * hash + Objects.hashCode(this.id);
        hash = 41 * hash + Objects.hashCode(this.bookName);
        hash = 41 * hash + Objects.hashCode(this.publishedYear);
        hash = 41 * hash + Objects.hashCode(this.quantity);
        hash = 41 * hash + Objects.hashCode(this.authors);
        hash = 41 * hash + Objects.hashCode(this.cover);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Book other = (Book) obj;
        if (!Objects.equals(this.bookName, other.bookName)) {
            return false;
        }
        if (!Objects.equals(this.publishedYear, other.publishedYear)) {
            return false;
        }
        if (!Objects.equals(this.quantity, other.quantity)) {
            return false;
        }
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        if (!Objects.equals(this.authors, other.authors)) {
            return false;
        }
        if (!Objects.equals(this.cover, other.cover)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "Book{" + "id=" + id 
                + ", bookName=" + bookName 
                + ", publishedYear=" + publishedYear 
                + ", quantity=" + quantity 
                + ", authors=" + Arrays.toString(authors.toArray())
                + ", cover=" + cover.getUrl() 
                + '}';
    }
    
}
