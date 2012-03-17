/*
 * SafeWith.me - store and share your files with OpenPGP encryption on any device via HTML5
 *
 * Copyright (c) 2012 Tankred Hase
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; version 2
 * of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

package me.safewith.dataAccess;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import javax.jdo.JDODataStoreException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.jdo.Transaction;

import me.safewith.model.DTO;


/**
 * This class represents a single point of access for generic object
 * persistence.
 */
public class GenericDAO {
	
	/**
	 * Create or update an entry by generating an id and then persisting it
	 */	
	public <T extends DTO> T persist(T entry) {
		PersistenceManager pm = PMF.getInstance().getPersistenceManager();
		
		try {
			T generated = pm.makePersistent(entry);
			if (generated == null) {
				throw new JDODataStoreException("Error while persisting entry!");
			}

			return generated;

		} finally {
			pm.close();
		}
	}

	/**
	 * Gets a persisted objects from the datastore by its id
	 */
	public <T extends DTO> T get(Class<T> cl, String id) {
		if (id == null)
			return null;

		PersistenceManager pm = PMF.getInstance().getPersistenceManager();
		
		try {
			T entry = pm.getObjectById(cl, id);
			return entry;
			
		} catch(Exception ex) {
			return null;

		} finally {
			pm.close();
		}
	}

	/**
	 * Delete a persisted object from the datastore.
	 */
	public <T extends DTO> void delete(Class<T> cl, String id) {
		PersistenceManager pm = PMF.getInstance().getPersistenceManager();
		Transaction tx = pm.currentTransaction(); 
	    
		try { 
	        tx.begin();
	        
	        T toDelete = pm.getObjectById(cl, id);
	        pm.deletePersistent(toDelete);
	        
	        tx.commit();
	        
	    } finally { 
	        if (tx.isActive()) { 
	            tx.rollback(); 
	        }
	        pm.close(); 
	    } 
	}

	/**
	 * Returns all persisted objects of a certain type from the datastore.
	 */
	public <T extends DTO> ArrayList<T> getAll(Class<T> cl) {

		ArrayList<T> list = new ArrayList<T>();
		PersistenceManager pm = PMF.getInstance().getPersistenceManager();
		
		try {
			Query query = pm.newQuery(cl);
			@SuppressWarnings("unchecked")
			Collection<T> result = (Collection<T>) query.execute();
			Iterator<T> it = result.iterator();

			while (it.hasNext()) {
				T o = it.next();
				list.add(o);
			}

		} finally {
			pm.close();
		}

		return list;
	}
	
	/**
	 * Filter a query by Class and field value
	 * @param cl
	 * @param fieldName The private field name as in datastore table
	 * @param FieldValue The field value
	 */
	public <T extends DTO> List<T> filterBy(Class<T> cl, String fieldName, String FieldValue) {
		if (fieldName == null || FieldValue == null)
			throw new IllegalArgumentException("Arugments cannot be null!");

		List<T> list = new ArrayList<T>();
		PersistenceManager pm = PMF.getInstance().getPersistenceManager();
		
		try {
			Query query = pm.newQuery(cl);
			query.setFilter(fieldName + " == arg0");
			query.declareParameters("java.lang.String arg0");
			@SuppressWarnings("unchecked")
			Collection<T> result = (Collection<T>) query.execute(FieldValue);
			Iterator<T> it = result.iterator();

			while (it.hasNext()) {
				T o = it.next();
				list.add(o);
			}

			return list;

		} finally {
			pm.close();
		}
	}

}
