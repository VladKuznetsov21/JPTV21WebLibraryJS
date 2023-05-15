/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Book;
import entity.History;
import entity.User;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author pupil
 */
@Stateless
public class HistoryFacade extends AbstractFacade<History> {

    @PersistenceContext(unitName = "JPTV21WebLibraryJSPU")
    private EntityManager em;
    @EJB private BookFacade bookFacade;
    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public HistoryFacade() {
        super(History.class);
    }
    public List<Book> getReadingBooks(User user) {
        List<Book> readingBooks = new ArrayList<>();
        readingBooks = em.createQuery("SELECT h.book FROM History h WHERE h.user = :user AND h.returnBook = null")
                .setParameter("user", user)
                .getResultList();
        return readingBooks;
    }
    public List<History> getReadingBooksHistory(User user) {
        List<History> readingBooksHistory = new ArrayList<>();
        readingBooksHistory = em.createQuery("SELECT h FROM History h WHERE h.user = :user AND h.returnBook = null")
                .setParameter("user", user)
                .getResultList();
        return readingBooksHistory;
    }
    public Map<Book,Integer> getTakedBooksInPeriod(String year, String month, String day) {
        if(year== null || year.isEmpty()){
            return new HashMap<>();
        }
        List<History> listHistories = null;
        //Если выбран только год
        if((month == null || month.isEmpty()) && (day == null || day.isEmpty())){
            LocalDateTime date1 = LocalDateTime.of(Integer.parseInt(year),1, 1, 0, 0, 0); 
            LocalDateTime date2 = date1.plusYears(1);
            Date beginYear = Date.from(date1.atZone(ZoneId.systemDefault()).toInstant());
            Date nextYear = Date.from(date2.atZone(ZoneId.systemDefault()).toInstant());
            listHistories = em.createQuery("SELECT h FROM History h WHERE h.takeOnBook > :beginYear AND h.takeOnBook < :nextYear")
                .setParameter("beginYear", beginYear)
                .setParameter("nextYear", nextYear)
                .getResultList();
        //Если выбран год и месяц
        }else if((month != null || !month.isEmpty()) && (day == null || day.isEmpty())){
            LocalDateTime date1 = LocalDateTime.of(Integer.parseInt(year),Integer.parseInt(month), 1, 0, 0, 0); 
            LocalDateTime date2 = date1.plusMonths(1);
            Date beginMonth = Date.from(date1.atZone(ZoneId.systemDefault()).toInstant());
            Date nextMonth = Date.from(date2.atZone(ZoneId.systemDefault()).toInstant());
            listHistories = em.createQuery("SELECT h FROM History h WHERE h.takeOnBook > :beginMonth AND h.takeOnBook < :nextMonth")
                .setParameter("beginMonth", beginMonth)
                .setParameter("nextMonth", nextMonth)
                .getResultList();
        }else{//Если выбран год, месяц и день
            LocalDateTime date1 = LocalDateTime.of(Integer.parseInt(year),Integer.parseInt(month), Integer.parseInt(day), 0, 0, 0); 
            LocalDateTime date2 = date1.plusDays(1);
            Date beginDay = Date.from(date1.atZone(ZoneId.systemDefault()).toInstant());
            Date nextDay = Date.from(date2.atZone(ZoneId.systemDefault()).toInstant());
            listHistories = em.createQuery("SELECT h FROM History h WHERE h.takeOnBook > :beginDay AND h.takeOnBook< :nextDay")
                .setParameter("beginDay", beginDay)
                .setParameter("nextDay", nextDay)
                .getResultList();
        }
        //Map для хранения сопоставления книга -> сколько раз выдана
        Map<Book, Integer>mapBooksRange = new HashMap<>();
        List<Book> books = bookFacade.findAll();
        for (Book book : books) { //перебираем все книги
            mapBooksRange.put(book, 0);
            for (History history : listHistories) {
                if(history.getBook().equals(book)){
                    Integer n = mapBooksRange.get(book);
                    n++;//к n добавляем 1, если книга есть в истории
                    mapBooksRange.put(book, n);//обновляем значение n для книги
                }
            }
        }
        return mapBooksRange; // возвращаем карту Книга->сколько раз выдана за указанный период
    }
}