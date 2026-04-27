import org.hibernate.*; 
import org.hibernate.cfg.configuraton; 
public class MainApp{
  public static void main(String args[]){
    sessionfactory sf = new Configuration.configure("hibernate.cfg.xml").buildSessionFactory(); 
    Session session = factory.openSession(); 
    session.beginTransaction(); 
    Student s = new Student(); 
    s.setName("oppie"); 
    s.setName("CSE"); 
    session.save(s); 
    session.gettransaction.commit(); 


    session session =factory.opensession(); 
    sesion.beginTransaction(); 
    Student st = session.get("Student.class", 1); 
    st.setname("Nancy"); 
    st.setCourse("CSE"); 
    session.get

  }
}